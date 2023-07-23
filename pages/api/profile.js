import { createRouter } from 'next-connect';
import multer from 'multer';
import sharp from 'sharp';
import { headerCookie } from '@/utils/RequestHelper';
import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';

// image will be stored in memory as buffer
const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage });
const uploadMiddleware = upload.single('photo');

const resizeImage = (req, res, next) => {
  if (!req.file) return next();
  if (req.file) {
    req.body.photo = `user-${req.body.userId}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize({
        width: 96,
        height: 96
      })
      .flatten({ background: { r: 255, g: 255, b: 255, alpha: 255 } })
      .toFormat('jpeg')
      .jpeg({ quality: 100 })
      .toFile(`public/img/users/${req.body.photo}`);
  }
  next();
};

const router = createRouter();

router
  .get(async (req, res) => {
    const endpoint = `${process.env.API_HOST}/api/v1/users/me`;
    const response = await axios.get(endpoint, headerCookie(req));
    resSuccess(res, response);
  })
  .use(uploadMiddleware)
  .use(resizeImage)
  .post(async (req, res) => {
    const endpoint = `${process.env.API_HOST}/api/v1/users/updateMe`;
    const response = await axios.patch(endpoint, req.body, headerCookie(req));

    resSuccess(res, response);
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error('My Profile Error 💥', err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  }
});

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
};
