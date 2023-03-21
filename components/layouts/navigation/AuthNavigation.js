import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/img/logo/BGtranstroke.png';
import styles from './AuthNavigation.module.scss';
import { useRouter } from 'next/router';
import useCheckLogin from '@/hooks/useCheckLogin';

export default function AuthNavigation() {
  const router = useRouter();

  const { isLoading } = useCheckLogin({
    redirectTo: '/',
    redirectIfFound: true
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <div className={styles.nav}>
      <Link href="/">
        <Image src={logo} alt="Logo" className="nav_logo" />
      </Link>
      <div>
        <ul>
          <li className="nav_actions-item">
            {router.pathname === '/account/login' ? (
              <Link href="/account/sign-up">
                <span className="btn btn-green">Sign Up</span>
              </Link>
            ) : (
              <Link href="/account/login">
                <span className="btn btn-white">Login</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
