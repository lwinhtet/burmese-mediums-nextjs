import styles from './NavDropdown.module.scss';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { svgIcon } from '@/utils/Helper';

export default function SettingsDropdown(props) {
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

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={ref}
        className={`${styles.spDropdown} ${styles.setting} ${
          isOpen ? styles.open : ''
        }`}
        onClick={toggleOpen}
      >
        {svgIcon('icon-dots-three-vertical', styles.settingSvg)}

        <div
          ref={contentRef}
          className={`${styles.content} ${getPositionClass()}`}
        >
          <ul className={styles.list}>
            <li onClick={() => close()}>
              <Link href="">
                <div className={styles.listItem}>About Us</div>
              </Link>
            </li>
            <li onClick={() => close()}>
              <Link href="">
                <div className={styles.listItem}>Our Ambition</div>
              </Link>
            </li>
            <hr />
            <li onClick={() => close()}>
              <Link href="">
                <div className={styles.listItem}>Terms & Service</div>
              </Link>
            </li>
            <li onClick={() => close()}>
              <Link href="">
                <div className={styles.listItem}>Privacy Policy</div>
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
