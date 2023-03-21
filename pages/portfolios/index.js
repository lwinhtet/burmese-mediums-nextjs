import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import styles from './portfolios.module.scss';
import Portal from '@/hoc/Portal';
import FilterModal from '@/modals/FilterModal';
import SmProfile from '@/parts/users/SmProfile';
import FilterPortfolios from '@/hooks/FilterPortfolios';
import { fetcherWithParams, getThumbnailImage } from '@/utils/RequestHelper';
import Link from 'next/link';

export default function Portfolios() {
  // const [shouldFetch, setShouldFetch] = useState(false);
  // checkOnlineStatus()
  const [queryParams, setQueryParams] = useState('');
  const { data: portfolios, error, isLoading } = useSWR(
    ['/api/portfolios', queryParams],
    fetcherWithParams
  );

  return (
    <>
      <Portal>
        <FilterModal />
      </Portal>
      <div className="wrapper">
        <div className={styles.container}>
          <div className={styles.filter}>
            <div className={styles.filterContent}>
              <div className={styles.filterHeader}>
                <h2>Filter</h2>
                <button>Clear All</button>
              </div>
              <div className={styles.filterBody}>
                <FilterPortfolios />
              </div>
            </div>
          </div>
          <section className={styles.portfolios}>
            <div className={styles.portfoliosHeader}>
              <h1>Portfolios</h1>
              <button id="openFilterModal" className="btn btn-white">
                Filter
              </button>
            </div>
            {error && <p>Something went wrong</p>}
            {isLoading && <Skeleton />}
            {isLoading && !portfolios ? (
              <Skeleton />
            ) : portfolios &&
              portfolios.status == 'success' &&
              portfolios.results > 0 ? (
              <ul className={styles.userList}>
                {portfolios.data.data.map((portfolio, i) => {
                  return (
                    <li key={i} className={styles.userItem}>
                      <div className={styles.userCard}>
                        <SmProfile user={portfolio} />
                        {portfolio.artworks.length > 0 ? (
                          <div className={styles.artworkCarousel}>
                            <div className={styles.artworkScroller}>
                              <div className={styles.userWorks}>
                                {portfolio.artworks.map((artwork, i) => {
                                  return (
                                    <div key={i} className={styles.picture}>
                                      <Link
                                        href={`/artworks/${encodeURIComponent(
                                          artwork.hashId
                                        )}`}
                                      >
                                        <div className="u-4-3-ratio">
                                          <Image
                                            src={getThumbnailImage(
                                              artwork.thumbnailFile
                                            )}
                                            alt="Pic"
                                            quality={40}
                                            fill
                                            sizes="(max-width: 768px) 100vw,
                                              (max-width: 1200px) 50vw,
                                              33vw"
                                          />
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={styles.errorContainer}>
                <p className="u-center-text dataNotFound">No data found!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

const Skeleton = () => {
  return (
    <ul className={styles.userList}>
      <li className={styles.userItem}>
        {[...Array(3)].map((e, i) => {
          return (
            <div key={i} className={styles.userCard}>
              <div className="d-flex">
                <div className={styles.skeletonProfile}></div>
                <div className={styles.skeletonData}>
                  <div className={styles.skeletonName}></div>
                  <div className={styles.skeletonName}></div>
                </div>
              </div>
              <div className={styles.artworkCarousel}>
                <div className={styles.artworkScroller}>
                  <div className={styles.userWorks}>
                    <div className={styles.picture}>
                      <div
                        className={`u-4-3-ratio ${styles.skeletonImg}`}
                      ></div>
                    </div>
                    <div className={styles.picture}>
                      <div
                        className={`u-4-3-ratio ${styles.skeletonImg}`}
                      ></div>
                    </div>
                    <div className={styles.picture}>
                      <div
                        className={`u-4-3-ratio ${styles.skeletonImg}`}
                      ></div>
                    </div>
                    <div className={styles.picture}>
                      <div
                        className={`u-4-3-ratio ${styles.skeletonImg}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </li>
    </ul>
  );
};

Portfolios.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
