import { resLoggedIn, resNotLoggedIn } from '@/utils/ResponseHelper';
import axios from 'axios';

export default async function handler(req, res) {
  const checkLogin = async () => {
    try {
      const endpoint = `${process.env.API_HOST}/api/v1/users/isLoggedIn`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Cookie: req.headers.cookie
          },
          withCredentials: true
        }
      );

      resLoggedIn(res, response);
    } catch (error) {
      console.log('isLoggedIn Check Error 💥', error);
      resNotLoggedIn(res);
    }
  };

  req.headers.cookie ? await checkLogin() : resNotLoggedIn(res);
}
