import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import SecondaryLayout from '@/layouts/secondary/SecondaryLayout';
import AuthNavigation from '@/layouts/navigation/AuthNavigation';
import logo from '@/public/img/logo/BGtranstroke.png';
import pic from '@/public/img/bm/photoshopW.png';
import styles from './auth.module.scss';
import Footer from '@/layouts/footer/footer';
import useForm from '@/hooks/useForm';
import axios from 'axios';
import validator from 'validator';
import useCheckLogin from '@/hooks/useCheckLogin';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const redirectIfLogin = {
    redirectTo: '/',
    redirectIfFound: true
  };
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(null);
  const initValue = {
    name: 'Hlan',
    email: 'hlan@gmail.com',
    password: 'qwE12#',
    termAgreed: false
  };

  const { isLoading } = useCheckLogin({
    redirectTo: '/',
    redirectIfFound: true
  });

  useGoogleAuth(isLoading, redirectIfLogin);

  const signUpFn = () => {
    try {
      setIsError(null);
      setIsSending(true);

      if (!validateFields()) {
        setEmptyPassword();
        return;
      }
      axios
        .post('/api/auth/sign-up', inputs)
        .then(res => {
          if (res.data.status === 'success') router.push('/account/login');
        })
        .catch(error => {
          console.log(error);
          setIsError(error.response.data.message);
        })
        .finally(() => setIsSending(false));
    } catch (error) {
      setEmptyPassword();
      setIsError('Something went wrong! Try again Later');
    }
  };

  const validateFields = () => {
    if (validator.isEmpty(inputs.name)) {
      setIsError('Username field is required');
      return;
    }

    if (validator.isEmpty(inputs.email)) {
      setIsError('Email address field is required');
      return;
    }

    if (validator.isEmpty(inputs.password)) {
      setIsError('Password field is required');
      return;
    }

    if (inputs.termAgreed === false) {
      setIsError(
        'You must accept Terms and Conditions to register an account!'
      );
      return;
    }

    if (!validator.isEmail(inputs.email)) {
      setIsError('Invalid email address');
      return;
    }

    if (
      !validator.isStrongPassword(inputs.password, {
        minLength: 6
      })
    ) {
      setIsError(
        'Password must have at least 6 characters, one special character, one number, one uppercase & lowercase letter'
      );
      return;
    }

    return true;
  };

  const setEmptyPassword = () => {
    inputs.password = '';
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    signUpFn,
    initValue
  );

  const signUpForm = (
    <form onSubmit={handleSubmit} className={`${styles.signupForm} form`}>
      <div className="form-control">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleInputChange}
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={inputs.email}
          onChange={handleInputChange}
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      {/* <div className="form-control">
        <label>Password</label>
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
      </div> */}
      <div className="form-control">
        <label>Password</label>

        <div className="pswInputWithShow">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            className="pswInput"
            autoComplete="off"
            autoCorrect="off"
            required
          />
          <span
            className="pswView"
            onClick={() => setShowPassword(!showPassword)}
          >
            Show
          </span>
        </div>
      </div>

      <div className={styles.term}>
        <input
          type="checkbox"
          name="termAgreed"
          value="true"
          onChange={handleInputChange}
          required
        />
        <p>
          Creating an account means you’re okay with our Terms of Service,
          Privacy Policy,
        </p>
      </div>
      <button
        type="submit"
        disabled={isSending}
        className={`${styles.signupButton} btn-green`}
      >
        Sign Up
      </button>
    </form>
  );

  if (isLoading === true) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Sign-up</title>
      </Head>
      <AuthNavigation />
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
          <div className={styles.signup}>
            <Image
              src={logo}
              alt="Logo"
              className={`${styles.logo} u-margin-center`}
              priority
            />
            {isError && <p className={styles.errorMsg}>{isError}</p>}
            {signUpForm}
            <div className="line">
              <span>or</span>
            </div>
            <div id="googleButton"></div>
            <p className={styles.new}>
              Alreay a user?{' '}
              <Link href="/account/login">
                <span className={styles.create}>Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

SignupPage.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>;
};
