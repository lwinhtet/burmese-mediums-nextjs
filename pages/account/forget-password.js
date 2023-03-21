import { useState } from 'react';
import Head from 'next/head';
import SecondaryLayout from '@/layouts/secondary/SecondaryLayout';
import AuthNavigation from '@/layouts/navigation/AuthNavigation';
import Footer from '@/layouts/footer/footer';
import styles from './auth.module.scss';
import useForm from '@/hooks/useForm';
import validator from 'validator';
import axios from 'axios';
import useCheckLogin from '@/hooks/useCheckLogin';

export default function ForgetPasswordPage() {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(null);
  const initValue = {
    email: 'lwinhtet@gmail.com'
  };

  const { isLoading } = useCheckLogin({
    redirectTo: '/',
    redirectIfFound: true
  });

  const forgetPasswordFn = async e => {
    try {
      setIsError(null);
      setIsSending(true);
      setIsSuccess(false);
      if (!validateFields()) {
        setEmptyEmail();
        return;
      }

      axios
        .post('/api/auth/forget-password', inputs)
        .then(res => {
          setIsSuccess(true);
          // console.log(res.data);
        })
        .catch(err => {
          setIsError(err.response.data.message);
        })
        .finally(() => {
          setEmptyEmail();
          setIsSending(false);
        });
    } catch (error) {
      setIsError('Something went wrong! Try again Later');
    }
  };

  const validateFields = () => {
    if (validator.isEmpty(inputs.email)) {
      setIsError('Email address field is required!');
      return false;
    }

    if (!validator.isEmail(inputs.email)) {
      setIsError('Invalid Email address!');
      return false;
    }
    return true;
  };

  const setEmptyEmail = () => {
    inputs.email = '';
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    forgetPasswordFn,
    initValue
  );

  const forgetPasswordForm = (
    <form onSubmit={handleSubmit} className={`${styles.forgetPswForm} form`}>
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
      <p className={styles.forgetPswInstruction}>
        Enter your registered email and we will send you password reset
        instructions on your Email
      </p>

      <button
        type="submit"
        disabled={isSending}
        className={`${styles.loginButton} btn-green u-mg-3y`}
      >
        {isSending ? 'Sending...' : 'Send'}
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
      <AuthNavigation />
      <div className={styles.content}>
        <div className={styles.dialog}>
          <div className={styles.forgetPsw}>
            <p className={styles.forgetPswTitle}>Forget Your Password?</p>
            {isSuccess && (
              <p className={styles.successMsg}>An email has been sent</p>
            )}
            {isError && <p className={styles.errorMsg}>{isError}</p>}
            {forgetPasswordForm}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

ForgetPasswordPage.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>;
};
