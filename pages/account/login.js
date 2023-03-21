import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryLayout from '@/layouts/secondary/SecondaryLayout';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import logo from '@/public/img/logo/BGtranstroke.png';
import pic from '@/public/img/bm/photoshopW.png';
import styles from './auth.module.scss';
import Footer from '@/layouts/footer/footer';
import useForm from '@/hooks/useForm';
import axios from 'axios';
import { loginValidation } from '@/validation/loginValidation';
import useAuth from '@/hooks/useAuth';
import useCheckLogin from '@/hooks/useCheckLogin';

export default function LoginPage() {
  const redirectIfLogin = {
    redirectTo: '/',
    redirectIfFound: true
  };
  const { setAuth, getRedirect, clearRedirect } = useAuth();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(null);
  const initValue = {
    email: 'lwinhtet@gmail.com',
    password: 'qwE12#'
  };

  const { isLoading } = useCheckLogin(redirectIfLogin);

  useGoogleAuth(isLoading, redirectIfLogin);

  const loginFn = async () => {
    try {
      setIsError(null);
      setIsSending(true);

      const { isValidated, message } = loginValidation(inputs);
      if (!isValidated) {
        setIsError(message);
        setEmptyPassword();
        return;
      }

      axios
        .post('/api/auth/login', inputs, {
          withCredentials: true
        })
        .then(res => {
          const user = res?.data?.data?.user;
          // const accessToken = res?.data?.token;
          setAuth({ user, isLoggedIn: true });
          const redirect = getRedirect();

          if (redirect !== null) {
            router.push(redirect); // go to page which redirected to login
            clearRedirect();
          } else {
            router.push('/');
          }
        })
        .catch(err => {
          setEmptyPassword();
          setIsError(err.response?.data.message);
        })
        .finally(() => setIsSending(false));
    } catch (error) {
      setEmptyPassword();
      setIsError('Something went wrong! Try again Later');
    }
  };

  const setEmptyPassword = () => {
    inputs.password = '';
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    loginFn,
    initValue
  );

  const loginForm = (
    <form onSubmit={handleSubmit} className={`${styles.loginForm} form`}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleInputChange}
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>

      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={inputs.password}
          onChange={handleInputChange}
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className={styles.forgetPassword}>
        <Link href="/account/forget-password">forget password</Link>
      </div>

      <button
        type="submit"
        disabled={isSending}
        className={`${styles.loginButton} btn-green`}
      >
        Login
      </button>
    </form>
  );

  if (isLoading === true) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.content}>
        <div className={styles.dialog}>
          <div className={styles.pictionary}>
            <Image
              src={pic}
              alt="Logo"
              className={`${styles.picture} u-margin-center`}
              priority
            />
            <div className={styles.description}>
              <div className={styles.descriptionHeader}>Lorem Ipsum</div>
              <div className={styles.descriptionContent}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </div>
            </div>
          </div>
          <div className={styles.login}>
            <Image
              src={logo}
              alt="Logo"
              className={`${styles.logo} u-margin-center`}
              priority
            />
            {/* <p className={`${styles.welcome}`}>Welcome</p> */}
            {isError && <p className={styles.errorMsg}>{isError}</p>}
            {loginForm}
            <div className="line">
              <span>or</span>
            </div>
            <div id="googleButton"></div>
            <p className={styles.new}>
              New User?{' '}
              <Link href="/account/sign-up">
                <span className={styles.create}>Create Account</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

LoginPage.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>;
};
