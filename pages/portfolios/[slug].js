import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import SmProfile from '@/parts/users/SmProfile';
import styles from './slug.module.scss';
import ArtworkItem from '@/parts/artwork/ArtworkItem';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getProfileImage } from '@/utils/RequestHelper';
import ImageWithFallback from '@/utils/ImageWithFallback';
import { inter, quicksand } from '@/utils/getFont';
import Image from 'next/image';

// import useSWR from 'swr';
// import { fetcher } from '@/utils/RequestHelper';

export default function UserPortfolioPage({ user }) {
  const router = useRouter();
  // const { data: user, error, isLoading } = useSWR(
  //   router?.query?.slug ? `/api/portfolios/${router.query.slug}` : null,
  //   fetcher
  // );

  return (
    <>
      {/* <div className={styles.coverPhotoContainer}>
        <Image
          src={cover}
          className={styles.coverPhoto}
          priority="true"
          alt="Cover Photo"
          fill
        ></Image>
      </div> */}
      <div className={styles.wrapper}>
        <div className={styles.profile}>
          <ImageWithFallback
            src={getProfileImage(user?.photo ? user.photo : null)}
            alt="Profile Photo"
            fallback="/img/default.png"
            width={75}
            height={75}
            className={styles.image}
            priority={true}
          />

          <div className={`${inter.className} ${styles.info}`}>
            <h1 className={styles.name}>{user.name}</h1>
            <h2 className={styles.job}>
              {user?.profession ? user.profession : 'Graphic Designer'}
            </h2>
            <h2 className={styles.location}>
              {user?.city ? user.city : 'Pogpa Thiri Township, Nay Pyi Taw'}
              {user?.country ? user.country : ', Myanmar'}
            </h2>
          </div>
        </div>

        {user.artworks.length > 0 ? (
          <section className="artwork">
            <div className="artworkGalleryGrid">
              {user.artworks.map((val, i) => (
                <ArtworkItem artwork={val} key={i} hideProfile={true} />
              ))}
            </div>
          </section>
        ) : (
          // <div className={`${quicksand.className} ${styles.nothingToshow}`}>
          //   <Image
          //     src="/img/bm/nothing.png"
          //     width={120}
          //     height={120}
          //     alt="No Upload To Show"
          //   />
          //   <p>No Upload To Show!</p>
          // </div>
          <></>
        )}
      </div>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: [
      // { params: { slug: 'lwinhtetthu12323' } },
      // { params: { slug: 'jonas-schmedtmann' } }
    ],
    fallback: 'blocking' // can also be true or false
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const res = await axios.get(`http://127.0.0.1:3000/api/portfolios/${slug}`);
  // const user = JSON.parse(await res.json());
  if (res.status !== 200) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }

  return { props: { user: res?.data?.data?.data } };
}

UserPortfolioPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
