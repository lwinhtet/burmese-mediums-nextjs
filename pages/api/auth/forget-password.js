import {
  resError,
  resInternalServerError,
  resSuccess
} from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const endpoint = `${process.env.API_HOST}/api/v1/users/forgotPassword`;
    const data = {
      email: req.body.email
    };
    return axios
      .post(endpoint, data)
      .then(response => resSuccess(res, response))
      .catch(error => resError(res, error));
  } catch (error) {
    resInternalServerError(res);
  }
}
