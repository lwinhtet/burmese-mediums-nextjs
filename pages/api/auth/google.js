import { setLoginCookie } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const endpoint = `${process.env.API_HOST}/api/v1/users/google`;
    const data = {
      token: req.body.token
    };
    return axios
      .post(endpoint, data)
      .then(response => {
        setLoginCookie(res, response);
        res.status(response.status).json(response.data);
      })
      .catch(error =>
        res.status(error.response.status).json(error.response.data)
      );
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Try again Later.'
    });
  }
}
