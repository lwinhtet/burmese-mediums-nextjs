import useModalHandler from '@/hooks/useModalHandler';
import FilterPortfolios from '@/hooks/FilterPortfolios';
import styles from './FilterModal.module.scss';

export default function FilterModal() {
  useModalHandler('filterModal', 'openFilterModal');

  return (
    <div
      id="filterModal"
      className={`modal ${styles.filterModal} min-d-none-xs`}
    >
      <div className="modal-content2">
        <div className={styles.header}>
          <p>
            Filter<button>Clear All</button>
          </p>
          <span className="close-modal close-filterModal">&times;</span>
        </div>
        <div className={styles.filterModalBody}>
          <FilterPortfolios />
        </div>
      </div>
    </div>
  );
}
