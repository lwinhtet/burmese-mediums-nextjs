import Image from 'next/image';
import Link from 'next/link';
import styles from './SmProfile.module.scss';
import { getProfileImage } from '@/utils/RequestHelper';
import ImageWithFallback from '@/utils/ImageWithFallback';

export default function SmProfile({ user }) {
  return (
    <div className="d-inline-b">
      <div className={styles.userProfile}>
        <div className={styles.profilePic}>
          <Link href={`/portfolios/${user?.slug}`}>
            <ImageWithFallback
              src={getProfileImage(user?.photo ? user.photo : null)}
              alt="Profile Photo"
              fallback="/img/default.png"
              width={60}
              height={60}
              priority={true}
            />
          </Link>
        </div>
        <div className={styles.info}>
          <h2>{user?.name ? user.name : '- - -'}</h2>

          <p className={styles.profession}>{user?.profession}</p>
          <p className={styles.city}>
            {user?.city} {user?.country && `, ${user?.country}`}
          </p>
        </div>
      </div>
    </div>
  );
}
