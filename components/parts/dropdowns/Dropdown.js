import styles from './Dropdown.module.scss';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { svgIcon } from '@/utils/Helper';
import { keyCode } from '@/data/staticdata';

export default function Dropdown({
  title,
  position,
  onChangeFn,
  selected = 'latest'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const contentRef = useRef();
  const [currentFocus, setCurrentFocus] = useState(0);

  const list = [
    {
      id: 1,
      name: 'Latest',
      value: 'latest'
    },
    {
      id: 2,
      name: 'Oldest',
      value: 'oldest'
    }
  ];

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
        className={`${styles.spDropdown} ${isOpen ? styles.open : ''}`}
        onClick={toggleOpen}
        onKeyDown={keyDownFn}
        role="button"
        // aria-controls="dp-result-list"
        aria-autocomplete="list"
      >
        <span className="d-flex align-center flex-between">
          {title}
          {svgIcon('icon-chevron-down', styles.dDownArrowIcon)}
        </span>
        <div
          ref={contentRef}
          className={`${styles.content} ${getPositionClass()}`}
        >
          <ul
            className="myList"
            // id="dp-result-list"
            role="listbox"
            aria-expanded="true"
            aria-hidden="false"
          >
            {list.map((v, i) => {
              return (
                <li
                  role="button"
                  className={`${selected === v.value ? 'active ' : ''}${
                    currentFocus === i ? 'autocomplete-active' : ''
                  }`}
                  key={i}
                  onClick={() => {
                    onChangeFn(v.value);
                    setIsOpen(false);
                  }}
                >
                  {v.name}
                </li>
              );
            })}
          </ul>
        </div>
      </button>
    </>
  );

  function keyDownFn(e) {
    let li;
    const key = e.which || e.keyCode;

    if (contentRef) li = contentRef?.current?.getElementsByTagName('li');

    if (key == keyCode.DOWN) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      if (currentFocus < list.length - 1) setCurrentFocus(currentFocus + 1);
    } else if (key == keyCode.UP) {
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      if (list.length > 0 && currentFocus > 0)
        setCurrentFocus(currentFocus - 1);
    } else if (key == keyCode.ENTER) {
      if (!isOpen) return;
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      // e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (li) li[currentFocus]?.click();
        // if i set to true, onclick will run twice and isOpen will be 'false'
        setIsOpen(true);
      }
    } else if ([keyCode.TAB, keyCode.ESC, keyCode.RETURN].includes(key)) {
      // inputReset();
    }
  }

  function toggleOpen(e) {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      setIsOpen(!isOpen);
    }
  }

  function getPositionClass() {
    return position == 'right' ? styles.contentRight : styles.contentLeft;
  }
}
