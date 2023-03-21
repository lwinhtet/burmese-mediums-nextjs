import { useEffect } from 'react';
import router from 'next/router';
import axios from 'axios';
import useAuth from './useAuth';
import { resInternalServerError } from '@/utils/ResponseHelper';

export default function useGoogleAuth(
  isLoading = false,
  redirectIfLogin = null
) {
  const { auth, setAuth } = useAuth();
  const googleSignInFn = response => {
    try {
      axios
        .post('/api/auth/google', { token: response.credential })
        .then(res => {
          setAuth(() => {
            return {
              user: res?.data?.data.user,
              isLoggedIn: true
            };
          });

          if (redirectIfLogin) {
            const { redirectTo, redirectIfFound } = redirectIfLogin;
            if (redirectTo && redirectIfFound) {
              router.push(redirectTo);
            }
          }
        })
        .catch(error => console.log(33, error));
    } catch (error) {
      resInternalServerError();
    }
  };

  // In '_app.js', we provided this script link 'https://accounts.google.com/gsi/client'
  // to get access to google
  useEffect(() => {
    if (auth.isLoggedIn === false) {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: googleSignInFn
        });

        if (document.getElementById('googleButton') && !isLoading) {
          const textContent =
            router.pathname === '/account/login'
              ? 'signin_with'
              : 'signup_with';
          google.accounts.id.renderButton(
            document.getElementById('googleButton'),
            { theme: 'outline', size: 'large', text: textContent } // customization attributes
          );
        }

        google.accounts.id.prompt(); // also display the One Tap dialog
      }
    }
  }, [isLoading, auth]);
}
