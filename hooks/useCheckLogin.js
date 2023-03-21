import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useAuth from '@/hooks/useAuth';
import { fetcher } from '@/utils/RequestHelper';

export default function useCheckLogin({
  redirectTo = null,
  redirectIfFound = false
}) {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  // first, hide the unauth content before checking user's login
  const [isLoading, setIsLoading] = useState(true);

  // go findout if user is logged in when we never checked
  const { data } = useSWR(
    auth?.isLoggedIn === null ? '/api/auth/is-logged-in' : null,
    fetcher
  );

  // We set 'isLoading=true' when want to redirect without flashing
  // We set 'isLoadding=false' to show blocking content
  useEffect(() => {
    if (auth?.isLoggedIn && !redirectTo) {
      // to show home navbar when redirect from login
      return setIsLoading(false);
    }

    if (auth?.isLoggedIn === false) {
      // when 'logout' is clicked, and we have to update auth data with useAuth
      // then this useEffect trigger as 'auth' data are in dependancy
      // we're catching here to show auth pages
      return setIsLoading(false);
    }

    // this is for when data was arrived
    if (data?.is_login) {
      setAuth(() => {
        return {
          user: data?.data?.user,
          // accessToken: data?.token,
          isLoggedIn: true
        };
      });

      if (redirectTo && redirectIfFound) {
        router.push(redirectTo);
        return setIsLoading(true);
      } else {
        return setIsLoading(false);
      }
    }

    // this is also for when data was arrived
    if (data?.is_login == false) {
      setAuth({
        isLoggedIn: false
      });
      return setIsLoading(false);
    }

    // return setIsLoading(false);
  }, [auth, data, redirectIfFound, redirectTo, router, setAuth]);

  return { isLoading };
}
