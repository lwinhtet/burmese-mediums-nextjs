import { getProfileImage, getThumbnailImage } from '@/utils/RequestHelper';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ArtworkItem.module.scss';

export default function ArtworkItem({ artwork, hideProfile = false }) {
  return (
    <div className={styles.artworkGridItem}>
      <Link href={`/artworks/${encodeURIComponent(artwork.hashId)}`}>
        <div className={styles.artworkThumbnail}>
          <Image
            src={getThumbnailImage(artwork.thumbnailFile)}
            alt="artwork"
            className={styles.artworkGridImg}
            priority={true}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            fill
          />

          <div className={styles.artworkMedia}>
            <div className={styles.artworkMediaIcon}>
              <div className="artwork-icon">
                <i className="icon-basic-picture-multiple"></i>
              </div>
            </div>
            <div className={styles.artworkMediaIcon}>
              <div className="artwork-icon">
                <i className="icon-basic-video"></i>
              </div>
            </div>
          </div>
          <div className={styles.artworkName}>{artwork.title}</div>
        </div>
      </Link>
      {!hideProfile && (
        <div className={styles.artworkArtistInfo}>
          <div className={styles.artworkArtistPhoto}>
            <Image
              src={getProfileImage(
                artwork?.user?.photo ? artwork.user.photo : null
              )}
              alt="artist"
              width={200}
              height={200}
              className={styles.artworkArtistPhotoItem}
            />
          </div>
          <div className={styles.artworkArtistName}>
            <a href="#">Lwin Htet Thu</a>
          </div>
          {artwork.team && (
            <div className={styles.artworkParticipents}>Team</div>
          )}
          {artwork.info && <div className={styles.artworkInfo}>info</div>}
        </div>
      )}
    </div>
  );
}
