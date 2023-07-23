import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { query, method } = req;
    const endpoint = `${process.env.API_HOST}/api/v1/portfolios/${query.slug}`;

    switch (method) {
      case 'GET':
        {
          const response = await axios.get(endpoint);
          // res.status(response.status).json(response.data);
          resSuccess(res, response);
        }
        break;

      // case 'POST':
      //   {
      //   }
      //   break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    resInternalServerError(res);
  }
}
