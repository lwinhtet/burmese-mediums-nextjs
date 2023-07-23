import HeaderLayout from '@/layouts/header/HeaderLayout';
import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import ArtworkItem from '@/parts/artwork/ArtworkItem';
import Dropdown from '@/parts/dropdowns/Dropdown';
import MultiSelectDropdown from '@/parts/dropdowns/MultiSelectDropdown';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import styles from './HomePage.module.scss';
import useSWR from 'swr';
import { fetcher, fetcherWithParams } from '@/utils/RequestHelper';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function HomePage() {
  useGoogleAuth();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState('');
  const [topics, setTopics] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [sort, setSort] = useState({ query: 'latest' });
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data } = useSWR('/api/staticdata', fetcher);
  const { data: artworks, error, isLoading } = useSWR(
    shouldFetch ? ['/api/artworks', queryParams] : null,
    fetcherWithParams
  );

  useEffect(() => {
    let str = '?sort=latest';
    if (
      localStorage.getItem('sort') !== null &&
      localStorage.getItem('sort') !== ''
    ) {
      str = `?sort=${localStorage.getItem('sort')}`;
      setSort({ query: localStorage.getItem('sort') });
    }

    ['topics', 'softwares', 'mediums'].forEach(val => {
      if (
        localStorage.getItem(val) !== null &&
        localStorage.getItem(val) !== ''
      ) {
        str += `&${val}=${localStorage.getItem(val)}`;
        if (val === 'topics') setTopics(localStorage.getItem(val).split(','));
        if (val === 'softwares')
          setSoftwares(localStorage.getItem(val).split(','));
        if (val === 'mediums') setMediums(localStorage.getItem(val).split(','));
      }
    });

    setShouldFetch(true);
    setQueryParams(str);

    router.push(str, undefined, { shallow: true });
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.isReady) {
      const str = setQueryStrings();
      setQueryParams(str);
      router.push(str, undefined, { shallow: true });
    }
  }, [router.isReady, topics, softwares, mediums, sort]);

  const onChangeTopics = e => {
    const { value, checked } = e.target;

    if (checked) {
      setTopics([...topics, value]);
      setLocal('topics', [...topics, value]);
    } else {
      let filter = topics.filter(e => e !== value);
      setTopics(filter);
      setLocal('topics', filter);
    }
  };

  const onChangeMediums = e => {
    const { value, checked } = e.target;

    if (checked) {
      setMediums([...mediums, value]);
      setLocal('mediums', [...mediums, value]);
    } else {
      let filter = mediums.filter(e => e !== value);
      setMediums(filter);
      setLocal('mediums', filter);
    }
  };

  const onChangeSoftwares = e => {
    const { value, checked } = e.target;

    if (checked) {
      setSoftwares([...softwares, value]);
      setLocal('softwares', [...softwares, value]);
    } else {
      let filter = softwares.filter(e => e !== value);
      setSoftwares(filter);
      setLocal('softwares', filter);
    }
  };

  const onChangeSort = val => {
    setSort({ query: val });
    localStorage.setItem('sort', val);
  };

  const setQueryStrings = () => {
    let string = `?sort=${sort.query}`;
    if (topics.length > 0) string += `&topics=${topics.join(',')}`;
    if (mediums.length > 0) string += `&mediums=${mediums.join(',')}`;
    if (softwares.length > 0) string += `&softwares=${softwares.join(',')}`;
    return string;
  };

  const setLocal = (name, value) => {
    localStorage.setItem(name, value.join(','));
  };

  const Skeleton = () => {
    return [...Array(8)].map((e, i) => {
      return (
        <div key={i}>
          <div className={`u-4-3-ratio ${styles.skeletonImg}`}></div>
          <div className={styles.skeletonProfile}>
            <div className={styles.skeletonProfileImg}></div>
            <div className={styles.skeletonName}></div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="wrapper">
      {/* <HeaderLayout /> */}
      <div className="containerSm">
        <section className={styles.filter}>
          <div className={styles.filterContent}>
            <MultiSelectDropdown
              dataList={data?.topics}
              title="Topics"
              position="left"
              onChangeFn={onChangeTopics}
              selected={topics}
              customClass={styles.multiselect}
            />
            <MultiSelectDropdown
              dataList={data?.mediums}
              title="Mediums"
              position="left"
              onChangeFn={onChangeMediums}
              selected={mediums}
              customClass={styles.multiselect}
            />
            <MultiSelectDropdown
              dataList={data?.softwares}
              title="Softwares"
              position="left"
              onChangeFn={onChangeSoftwares}
              selected={softwares}
              customClass={styles.multiselect}
            />
          </div>
          <div className={`${styles.filterContent} max-d-none-sm`}>
            <Dropdown
              title="Sort By"
              position="right"
              selected={sort.query}
              onChangeFn={onChangeSort}
            />
          </div>
        </section>
        <section className="artwork">
          {isLoading && (
            <div className="artworkGalleryGrid">
              <Skeleton />
            </div>
          )}
          {!isLoading && (error || artworks?.status == 'fail') && (
            <p className="u-center-text dataNotFound">Something went wrong!</p>
          )}
          {!isLoading &&
            artworks?.status == 'success' &&
            (artworks.data.data.length > 0 ? (
              <div className="artworkGalleryGrid">
                {artworks.data.data.map((val, i) => (
                  <ArtworkItem artwork={val} key={i} />
                ))}
              </div>
            ) : (
              <p className="u-center-text dataNotFound">No data found!</p>
            ))}
          {/* {isLoading ? (
            <div className="artworkGalleryGrid">
              <Skeleton />
            </div>
          ) : artworks.status == 'success' ? (
            <div className="artworkGalleryGrid">
              {artworks.data.data.map((val, i) => (
                <ArtworkItem artwork={val} key={i} />
              ))}
            </div>
          ) : (
            <p className="u-center-text dataNotFound">No data found!</p>
          )} */}
        </section>
      </div>
    </div>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
// export async function getStaticProps() {
//   const res = await axios.get('http://localhost:3000/api/artworks');
//   // const artworks = JSON.parse(await res.json());

//   return {
//     props: {
//       artworks: res.data.data.data
//     },
//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every 10 seconds
//     revalidate: 10 // In seconds
//   };
// }

HomePage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default HomePage;
