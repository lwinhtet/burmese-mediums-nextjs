import { headerCookie } from '@/utils/RequestHelper';
import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { query, method } = req;
    const endpoint = `${process.env.API_HOST}/api/v1/artworks/${query.hashId}`;

    switch (method) {
      case 'GET':
        {
          const response = await axios.get(endpoint);
          resSuccess(res, response);
        }
        break;

      // case 'POST':
      //   {
      //     // const data = {
      //     //   title: req.body.title,
      //     //   artworkFiles: req.body.artworkFiles,
      //     //   thumbnailFile: req.body.thumbnailFile,
      //     //   description: req.body.description,
      //     //   softwares: req.body.softwares,
      //     //   topics: req.body.topics,
      //     //   tags: req.body.tags,
      //     //   mediums: req.body.mediums
      //     // };
      //     // const response = await axios.post(endpoint, data, headerCookie(req));
      //     // resSuccess(res, response);
      //   }
      //   break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log('Artwork [HashId] Page Error 💥', error);
    resInternalServerError(res);
  }
}
