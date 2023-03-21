import styles from './MultiSelectDropdown.module.scss';
import { useEffect, useRef, useState } from 'react';
import { quicksand, inter } from '@/utils/getFont';
import { svgIcon } from '@/utils/Helper';

export default function MultiSelectDropdown({
  title,
  position,
  dataList,
  onChangeFn,
  selected,
  customClass
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const closeDropdown = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener('click', closeDropdown);

    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <>
      <button
        ref={ref}
        className={`${inter.className} ${styles.spDropdown} ${
          isOpen ? styles.open : ''
        } ${customClass}`}
        onClick={toggleOpen}
      >
        <span className="d-flex align-center flex-between">
          {title}
          {svgIcon('icon-chevron-down', styles.dDownArrowIcon)}
        </span>
        {selected.length > 0 && (
          <span className={styles.badges}>{selected?.length}</span>
        )}
        <div
          ref={contentRef}
          className={`${styles.content} ${getPositionClass()}`}
        >
          <ul className="myList">
            {dataList &&
              dataList.map(data => {
                return (
                  <li key={data.id}>
                    <input
                      type="checkbox"
                      value={data.id}
                      name={`${title}${data.id}`}
                      id={`${title}${data.id}`}
                      onChange={onChangeFn}
                      checked={selected?.includes(`${data.id}`)}
                    />
                    <label
                      htmlFor={`${title}${data.id}`}
                      className={styles.label}
                    >
                      {data.name}
                    </label>
                  </li>
                );
              })}
          </ul>
        </div>
      </button>
    </>
  );

  function toggleOpen(e) {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      setIsOpen(!isOpen);
    }
  }

  function getPositionClass() {
    return position == 'right' ? styles.contentRight : styles.contentLeft;
  }
}
