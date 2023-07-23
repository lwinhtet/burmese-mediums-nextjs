import { serialize } from 'cookie';
import router from 'next/router';

export const resSuccess = (res, responseData) => {
  res.status(responseData?.status).json(responseData?.data);
};

export const resError = (res, error) => {
  console.error('resError Error 💥', error);
  error?.response
    ? res.status(error?.response?.status).json({
        status: 'error',
        message: error?.response?.data?.message
      })
    : resInternalServerError(res);
};

export const resInternalServerError = res => {
  res.status(500).json({
    status: 'fail',
    message: 'Something went wrong! Try again Later'
  });
};

export const resLoggedIn = (res, responseData) => {
  res.status(200).json({
    is_login: true,
    data: responseData?.data?.data,
    token: responseData?.data?.token
  });
};

export const resNotLoggedIn = res => {
  res.status(200).json({ is_login: false });
};

export const setLoginCookie = (res, responseData) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'Lax',
    path: '/'
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  return res.setHeader(
    'Set-Cookie',
    serialize('accessToken', responseData.data.token, cookieOptions)
  );
};

export const setLogoutCookie = res => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'Lax',
    path: '/'
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  return res.setHeader(
    'Set-Cookie',
    serialize('accessToken', 'logged-out', cookieOptions)
  );
};

export const getRedirect = pathName => {
  return pathName == '/account/my-profile' || pathName == '/artworks/new';
};
// export const getRedirect = router => {
//   return (
//     router.asPath == '/account/my-profile' || router.asPath == '/artworks/new'
//   );
// };

const path = str => {
  return router.pathname.startsWith(str);
};
