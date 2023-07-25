import { createRouter } from 'next-connect';
import multer from 'multer';
import sharp from 'sharp';
import { headerCookie } from '@/utils/RequestHelper';
import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';
import { s3Upload, resizeBuffer, getParams } from '@/utils/spaceUpload';

// image will be stored in memory as buffer
const multerStorage = multer.memoryStorage();
// to test uploaded file is img

// if we dont provide destination, files will only save on memory
const upload = multer({ storage: multerStorage });

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const uploadMiddleware = upload.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'artworkFiles', maxCount: 3 }
]);

const resizeImage = async (req, res, next) => {
  if (!req.files) return next();

  // we store our image in memory to resize and then save it in our project
  // other middleware still need image name, so we passed here
  // resize the image from buffer and store it into our file destination
  if (req.files.thumbnailFile[0]) {
    // req.body.thumbnailFile = `tn-${req.body.userId}-${Date.now()}.jpeg`;
    // sharp(req.files.thumbnailFile[0].buffer)
    //   .resize({
    //     width: 600,
    //     height: 450
    //   })
    //   .flatten({ background: { r: 255, g: 255, b: 255, alpha: 255 } })
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 100 })
    //   .toFile(`public/img/thumbnails/${req.body.thumbnailFile}`);
    const resizedImageBuffer = await resizeBuffer(
      req.files.thumbnailFile[0].buffer,
      600,
      450
    );

    const params = getParams(
      `tn-${req.body.userId}-${Date.now()}.jpeg`,
      resizedImageBuffer
    );

    const imageUrl = `https://${params.Bucket}.sgp1.digitaloceanspaces.com/${params.Key}`;
    req.body.thumbnailFile = imageUrl;
    await s3Upload(params);
  }

  if (req.files.artworkFiles.length > 0) {
    req.body.artworkFiles = [];
    const uploadPromises = req.files.artworkFiles.map(async (file, i) => {
      // req.body.artworkFiles[i] = `asset-${i}-${
      //   req.body.userId
      // }-${Date.now()}.jpeg`;

      // sharp(req.files.artworkFiles[i].buffer)
      //   .resize({
      //     // width: 1000
      //     width: null,
      //     height: null
      //   })
      //   // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 255 } })
      //   .toFormat('jpeg')
      //   .jpeg({ quality: 100 })
      //   .toFile(`public/img/artworks/${req.body.artworkFiles[i]}`);
      const resizedImageBuffer = await resizeBuffer(
        req.files.artworkFiles[i].buffer,
        null,
        null
      );

      const params = getParams(
        `asset-${i}-${req.body.userId}-${Date.now()}.jpeg`,
        resizedImageBuffer,
        'public'
      );

      const imageUrl = `https://${params.Bucket}.sgp1.digitaloceanspaces.com/${params.Key}`;
      req.body.artworkFiles[i] = imageUrl;
      return s3Upload(params);
    });

    // Wait for all the uploads to complete
    await Promise.all(uploadPromises);

    // req.body.artworkFiles = [];
    // req.files.artworkFiles.forEach(async (file, i) => {
    //   // req.body.artworkFiles[i] = `asset-${i}-${
    //   //   req.body.userId
    //   // }-${Date.now()}.jpeg`;

    //   // sharp(req.files.artworkFiles[i].buffer)
    //   //   .resize({
    //   //     // width: 1000
    //   //     width: null,
    //   //     height: null
    //   //   })
    //   //   // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 255 } })
    //   //   .toFormat('jpeg')
    //   //   .jpeg({ quality: 100 })
    //   //   .toFile(`public/img/artworks/${req.body.artworkFiles[i]}`);
    //   const resizedImageBuffer = await resizeBuffer(
    //     req.files.artworkFiles[i].buffer,
    //     null,
    //     null
    //   );

    //   const params = {
    //     Bucket: process.env.SPACES_BUCKET,
    //     Key: `asset-${i}-${req.body.userId}-${Date.now()}.jpeg`,
    //     Body: resizedImageBuffer
    //   };

    //   const imageUrl = `https://${params.Bucket}.sgp1.digitaloceanspaces.com/${params.Key}`;
    //   req.body.artworkFiles[i] = imageUrl;
    //   await s3Upload(params);
    // });
  }

  next();
};

const router = createRouter();

// Process a POST request
router
  .get(async (req, res) => {
    const params = req.url.split('artworks');
    const endpoint = `${process.env.API_HOST}/api/v1/artworks${params[1]}`;
    const response = await axios.get(endpoint);
    resSuccess(res, response);
  })
  .use(uploadMiddleware)
  .use(resizeImage)
  .post(async (req, res) => {
    const endpoint = `${process.env.API_HOST}/api/v1/artworks`;
    const select = ['softwares', 'topics', 'tags', 'mediums'];
    select.forEach(keyName => {
      req.body[keyName] === ''
        ? (req.body[keyName] = [])
        : (req.body[keyName] = req.body[keyName].split(','));
    });
    const response = await axios.post(endpoint, req.body, headerCookie(req));
    resSuccess(res, response);
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke in next-connect: check your code!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  }
});

// eslint-disable-next-line import/no-anonymous-default-export
// export default (req, res) => {
//   httpProxyMiddleware(req, res, {
//     target: 'http://localhost:8080/api/v1/artworks',
//     pathRewrite: [
//       {
//         patternStr: '^/api/artworks',
//         replaceStr: ''
//       }
//     ]
//   });
// };

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
};
// There is one last step we cannot forget about. By default, Next.js
// automatically parses the API request body. We need to disable the
// body parsing so we can consume the body as a stream to upload the files.
// Every API route can export a config object to change the default configs.
// Below, notice the config object after the export default apiRoute;.
// This is how we use the Next.js custom config object to disable body parsing.
