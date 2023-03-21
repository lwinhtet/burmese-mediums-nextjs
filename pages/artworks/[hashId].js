import Image from 'next/image';
import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import SmProfile from '@/parts/users/SmProfile';
import styles from './hashId.module.scss';
import { fetcher, getAssetsImage } from '@/utils/RequestHelper';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';

export default function SingleArtworkPage({ artwork }) {
  const [select, setSelect] = useState(artwork.artworkFiles[0]);
  const { data, error, isLoading } = useSWR(
    `/api/artworks/${artwork.hashId}`,
    fetcher
  );
  console.log(data);
  const Skeleton = () => {
    return (
      <div className={styles.userCard}>
        <div className="d-flex">
          <div className={styles.skeletonProfile}></div>
          <div className={styles.skeletonData}>
            <div className={styles.skeletonName}></div>
            <div className={styles.skeletonName}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.artwork}>
          <div className={styles.imgContainer}>
            {/* <div className="u-4-3-ratio"> */}
            {artwork.artworkFiles.length > 0 ? (
              // <Image
              //   src={getAssetsImage(select)}
              //   alt="artwork"
              //   className={styles.artworkGridImg}
              //   sizes="(max-width: 768px) 100vw,
              //   (max-width: 1200px) 50vw,
              //   33vw"
              //   fill
              // />
              <img
                src={getAssetsImage(select)}
                alt="artwork"
                className={styles.artworkGridImg}
              />
            ) : (
              <p className={`u-center ${styles.imageNotFound}`}>
                Image not Found!
              </p>
            )}
            {/* </div> */}
          </div>
          <div className="d-flex">
            {artwork.artworkFiles.map((file, i) => {
              return (
                <div
                  key={i}
                  className={styles.smImgContainer}
                  onClick={() => setSelect(file)}
                >
                  <div className="u-4-3-ratio">
                    <Image
                      src={getAssetsImage(file)}
                      alt="artwork"
                      className={styles.artworkGridImg}
                      sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                      fill
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.profile}>
          {error ? (
            <SmProfile user={artwork.user} />
          ) : (
            <>
              {isLoading && <Skeleton />}
              {data && !isLoading && <SmProfile user={data.data.data.user} />}
            </>
          )}
        </div>

        <div className={styles.description}>
          <h3>Description</h3>
          <p className={styles.text}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
            <br /> It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </p>
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const hashId = context.params.hashId;
//   const res = await fetch(`http://127.0.0.1:3000/api/artworks/${hashId}`);
//   const artwork = await res.json();

//   if (artwork.status === 'fail') {
//     return {
//       notFound: true
//     };
//   }

//   return { props: { artwork: artwork } };
// }
export function getStaticPaths() {
  return {
    paths: [
      // { params: { hashId: 'R7YpC8f41K' } },
      // { params: { hashId: 'lgYPCnfm7k' } }
    ],
    fallback: 'blocking' // can also be true or 'blocking'
  };
}

export async function getStaticProps(context) {
  const hashId = context.params.hashId;
  const res = await axios.get(`http://127.0.0.1:3000/api/artworks/${hashId}`);
  // const artwork = JSON.parse(await res.json());

  if (res.status !== 200) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }

  return { props: { artwork: res?.data?.data?.data } };
}

SingleArtworkPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
