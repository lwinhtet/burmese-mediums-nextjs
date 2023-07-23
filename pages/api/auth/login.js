import {
  resError,
  resInternalServerError,
  resSuccess,
  setLoginCookie
} from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const endpoint = `${process.env.API_HOST}/api/v1/users/login`;
    const data = {
      email: req.body.email,
      password: req.body.password
    };
    // You have a promise and u should return it bec without 'return'
    // your api function is being called, a promise is kicked off, but the processing
    // for your api call continues to the end (without waiting for the promise to resolve),
    // and the api call ends with no response
    return axios
      .post(endpoint, data, {
        headers: {
          Cookie: req.headers.cookie
        },
        withCredentials: true
      })
      .then(response => {
        res = setLoginCookie(res, response);
        resSuccess(res, response);
        // res.status(response.status).json(response.data);
      })
      .catch(error => {
        resError(res, error);
        // res.status(error?.response?.status).json(error?.response?.data);
      });
  } catch (error) {
    resInternalServerError(res);
  }
}
