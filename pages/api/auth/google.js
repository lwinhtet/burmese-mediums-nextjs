import {
  resError,
  resInternalServerError,
  resSuccess,
  setLoginCookie
} from '@/utils/ResponseHelper';
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
        resSuccess(res, response);
        // res.status(response.status).json(response.data);
      })
      .catch(error => resError(res, error));
  } catch (error) {
    resInternalServerError(res);
  }
}
