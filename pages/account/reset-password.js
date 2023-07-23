import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SecondaryLayout from '@/layouts/secondary/SecondaryLayout';
import AuthNavigation from '@/layouts/navigation/AuthNavigation';
import Footer from '@/layouts/footer/footer';
import styles from './auth.module.scss';
import useForm from '@/hooks/useForm';
import validator from 'validator';
import axios from 'axios';
import useCheckLogin from '@/hooks/useCheckLogin';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPsw, setShowPsw] = useState(false);
  const [showPswConfirm, setShowPswConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(null);
  const initValue = {
    password: '',
    passwordConfirm: ''
  };

  const { isLoading } = useCheckLogin({
    redirectTo: '/',
    redirectIfFound: true
  });

  const resetPasswordFn = async e => {
    try {
      setIsError(null);
      setIsSending(true);
      if (!validateFields()) {
        setEmptyPasswords();
        return;
      }

      axios
        .post(`/api/auth/reset-password?token=${router.query.token}`, inputs)
        .then(res => {
          router.push('/account/login');
        })
        .catch(err => {
          setEmptyPasswords();
          setIsError(err.response.data.message);
        })
        .finally(() => setIsSending(false));
    } catch (error) {
      setIsError('Something went wrong! Try again Later');
    }
  };

  const validateFields = () => {
    if (validator.isEmpty(inputs.password)) {
      setIsError('Password field is required!');
      return false;
    }

    if (validator.isEmpty(inputs.passwordConfirm)) {
      setIsError('Confirm Password field is required!');
      return false;
    }

    if (inputs.password !== inputs.passwordConfirm) {
      setIsError('The password confirmation does not match!');
      return false;
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

  const { inputs, handleInputChange, handleSubmit } = useForm(
    resetPasswordFn,
    initValue
  );

  const setEmptyPasswords = () => {
    inputs.password = '';
    inputs.passwordConfirm = '';
  };

  const resetPasswordForm = (
    <form onSubmit={handleSubmit} className={`${styles.resetPswForm} form`}>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <div className="pswInputWithShow">
          <input
            type={showPsw ? 'text' : 'password'}
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            className="pswInput"
            autoComplete="off"
            autoCorrect="off"
            required
          />
          <span className="pswView" onClick={() => setShowPsw(!showPsw)}>
            Show
          </span>
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="password">Confirm Password</label>
        <div className="pswInputWithShow">
          <input
            type={showPswConfirm ? 'text' : 'password'}
            name="passwordConfirm"
            value={inputs.passwordConfirm}
            onChange={handleInputChange}
            className="pswInput"
            autoComplete="off"
            autoCorrect="off"
            required
          />
          <span
            className="pswView"
            onClick={() => setShowPswConfirm(!showPswConfirm)}
          >
            Show
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSending}
        className={`${styles.resetPswButton} btn-green u-mg-3y`}
      >
        Change
      </button>
    </form>
  );

  if (isLoading === true) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <AuthNavigation />
      <div className={styles.content}>
        <div className={styles.dialog}>
          <div className={styles.resetPsw}>
            <p className={styles.resetPswTitle}>Reset Password</p>
            {isError && <p className={styles.errorMsg}>{isError}</p>}
            {resetPasswordForm}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

ResetPasswordPage.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>;
};
