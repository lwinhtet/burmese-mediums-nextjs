import styles from './SizerButton.module.scss';

export default function SizerButton() {
  return (
    <div className={styles.sizer}>
      <button className={styles.sizerToggleIcon}>
        <svg className={styles.sizerIcon}>
          <use xlinkHref="/img/icomoon/sprite.svg#icon-plus"></use>
        </svg>
      </button>
      <button className={styles.sizerToggleIcon}>
        <svg className={styles.sizerIcon}>
          <use xlinkHref="/img/icomoon/sprite.svg#icon-minus"></use>
        </svg>
      </button>
    </div>
  );
}
