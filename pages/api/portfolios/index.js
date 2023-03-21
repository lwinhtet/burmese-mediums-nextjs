import { headerCookie } from '@/utils/RequestHelper';
import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const endpoint = `${process.env.API_HOST}/api/v1/portfolios`;
    switch (method) {
      case 'GET':
        {
          const response = await axios.get(endpoint);
          res.status(response.status).json(response.data);
        }
        break;

      case 'POST':
        {
          console.log('my portfolio post');
          // const data = {
          //   title: req.body.title,
          //   artworkFiles: req.body.artworkFiles,
          //   thumbnailFile: req.body.thumbnailFile,
          //   description: req.body.description,
          //   softwares: req.body.softwares,
          //   topics: req.body.topics,
          //   tags: req.body.tags,
          //   mediums: req.body.mediums
          // };

          // const response = await axios.post(endpoint, data, headerCookie(req));
          // resSuccess(res, response);
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    // console.log(333, error);
    resInternalServerError(res);
  }
}
