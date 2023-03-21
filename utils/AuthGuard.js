// import useAuth from '@/hooks/useAuth';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export function AuthGuard({ children }) {
//   const { auth, setRedirect } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!auth.accessToken) {
//       // remember the page that user tried to access
//       setRedirect(router.route);
//       // redirect
//       router.push('/account/login');
//     }
//   }, []);

//   // const isAuthPage = () => {
//   //   return router.pathname !== '/account/login';
//   // };

//   // if auth initialized with a valid user show protected page
//   if (auth.user) {
//     return <>{children}</>;
//   }

//   /* otherwise don't return anything, will do a redirect from useEffect */
//   return null;
// }
