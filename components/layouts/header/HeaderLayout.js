import Image from 'next/image';
// import bm from '@/public/img/bm/PhotoshopWW.png';
import bm1 from '@/public/img/bm/boy.jpg';
// import bm2 from '@/public/img/bm/PhotoshopO.png';
import styles from './HeaderLayout.module.scss';
import { inter } from '@/utils/getFont';

export default function HeaderLayout() {
  // return <header className={styles.header}></header>;
  return (
    <div className={`${styles.container} ${inter.className}`}>
      <div className={styles.flex}>
        <Image src={bm1} alt="Main Image" width={400} />
        <div className={styles.text}>
          <h1 className={styles.small}>
            Let <span className={styles.big}>Showcase</span> Our Works
          </h1>
          <h1 className={styles.small}>
            Find the <span className={styles.big}>best</span> designers and
            creatives
          </h1>
          <h1 className={styles.small}>
            In <span className={styles.big}>Myanmar</span>
          </h1>
        </div>
        {/* <Image src={bm1} alt="Main Image" width={500} />
      <Image src={bm2} alt="Main Image" width={500} /> */}
      </div>
    </div>
  );
}
