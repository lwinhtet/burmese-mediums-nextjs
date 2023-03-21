import { resSuccess, resInternalServerError } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { query, method } = req;
    const endpoint = `${process.env.API_HOST}/api/v1/users/${query.id}`;

    switch (method) {
      case 'GET':
        {
          // const response = await axios.get(endpoint);
          // console.log(555, response.data);
          // res.status(response.status).json(response.data);
          // resSuccess(res, response);
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
