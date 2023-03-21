import Image from 'next/image';
import bm from '@/public/img/bm/PhotoshopWW.png';
import bm1 from '@/public/img/bm/PhotoshopG.png';
import bm2 from '@/public/img/bm/PhotoshopO.png';
import styles from './HeaderLayout.module.scss';

export default function HeaderLayout() {
  // return <header className={styles.header}></header>;
  return (
    <div className="d-flex">
      <Image src={bm} alt="Main Image" width={500} />
      <Image src={bm1} alt="Main Image" width={500} />
      <Image src={bm2} alt="Main Image" width={500} />
    </div>
  );
}
