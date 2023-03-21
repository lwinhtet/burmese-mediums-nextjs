import styles from './NavDropdown.module.scss';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { getRedirect } from '@/utils/ResponseHelper';
import { getProfileImage } from '@/utils/RequestHelper';
import ImageWithFallback from '@/utils/ImageWithFallback';
import { inter } from '@/utils/getFont';

export default function ProfileDropdown(props) {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const closeDropdown = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener('click', closeDropdown);

    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);

  const logout = async () => {
    const response = await axios.post('/api/auth/logout');
    if (response.status === 200) {
      setAuth({ isLoggedIn: false });
      // localStorage.clear();
      // sessionStorage.clear();
      getRedirect(router.pathname) ? router.push('/') : null;
    }
    close();
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={ref}
        className={`${inter.className} ${styles.spDropdown} ${
          isOpen ? styles.open : ''
        }`}
        onClick={toggleOpen}
      >
        <ImageWithFallback
          src={getProfileImage(auth.user.photo ? auth.user.photo : null)}
          alt="Profile Photo"
          className={styles.userProfile}
          width={35}
          height={35}
        />
        {/* <Image
          src={getProfileImage(
            auth.user.photo ? auth.user.photo : null,
            auth.user.googleID
          )}
          alt="Profile Photo"
          className={styles.userProfile}
          width={35}
          height={35}
        /> */}
        <div
          ref={contentRef}
          className={`${styles.content} ${getPositionClass()}`}
        >
          <ul className={`list ${styles.list}`}>
            <li onClick={() => close()}>
              <Link href="/account/my-profile">
                <div className={styles.listItem}>Profile</div>
              </Link>
            </li>
            <li onClick={() => close()}>
              <Link href="/artworks/new">
                <div className={styles.listItem}>Upload Artwork</div>
              </Link>
            </li>
            <hr />
            <li onClick={() => close()}>
              <div className={styles.listItem}>
                <Link href="/portfolios/slug">My Portfolio</Link>
              </div>
            </li>
            <li onClick={() => close()}>
              <div className={styles.listItem}>
                <Link href="">My Collection</Link>
              </div>
            </li>
            <li onClick={() => close()}>
              <div className={styles.listItem}>
                <Link href="">Account Setting</Link>
              </div>
            </li>
            <li onClick={() => close()}>
              <Link href="">
                <div className={styles.listItem}>Change Password</div>
              </Link>
            </li>
            <hr />
            <li onClick={() => logout()}>
              <Link href="">
                <div className={styles.listItem}>Logout</div>
              </Link>
            </li>
          </ul>
        </div>
      </button>
    </>
  );

  function toggleOpen(e) {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      setIsOpen(!isOpen);
    }
  }

  function getPositionClass() {
    return props.position == 'right' ? styles.contentRight : styles.contentLeft;
  }
}
