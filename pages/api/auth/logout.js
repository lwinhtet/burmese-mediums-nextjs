import { setLogoutCookie } from '@/utils/ResponseHelper';
import axios from 'axios';
// import { serialize } from 'cookie';

export default async function handler(req, res) {
  const endpoint = `${process.env.API_HOST}/api/v1/users/logout`;

  try {
    const response = await axios.post(endpoint);

    res = setLogoutCookie(res);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error?.response?.status).json(error?.response?.data);
  }
}
