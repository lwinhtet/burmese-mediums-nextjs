import {
  resError,
  resInternalServerError,
  resSuccess
} from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const endpoint = `${process.env.API_HOST}/api/v1/users/resetPassword/${req.query.token}`;

    const data = {
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    };

    return axios
      .patch(endpoint, data)
      .then(response => resSuccess(res, response))
      .catch(error => resError(res, error));
  } catch (error) {
    resInternalServerError(res);
  }
}
