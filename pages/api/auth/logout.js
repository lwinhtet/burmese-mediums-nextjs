import { resError, resSuccess, setLogoutCookie } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  const endpoint = `${process.env.API_HOST}/api/v1/users/logout`;

  try {
    const response = await axios.post(endpoint);

    res = setLogoutCookie(res);
    resSuccess(res, response);
  } catch (error) {
    resError(res, error);
  }
}
