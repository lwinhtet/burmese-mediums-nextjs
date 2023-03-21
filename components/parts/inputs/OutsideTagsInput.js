import { useRef, useState, useEffect } from 'react';
import styles from './OutsideTagsInput.module.scss';
import TagItem from '@/parts/tags/TagItem';
import { keyCode } from '@/data/staticdata';

export default function OutsideTagsInput({ inputName, dataList, onChangeOTI }) {
  const contentRef = useRef();
  // Refs are useful when getting user input,
  // DOM element properties and storing constantly updating values
  const inputRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const notFoundLi = <li className="nf">Not Found!</li>;
  const [currentFocus, setCurrentFocus] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedName, setSelectedName] = useState([]);

  useEffect(() => {
    if (filteredData?.length > 0) {
      setCurrentFocus(filteredData.length - 1);
    }
  }, [filteredData]);

  useEffect(() => {
    const closeDropdown = e => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        contentRef.current &&
        !contentRef.current.contains(e.target)
      ) {
        inputReset();
      }
    };

    document.body.addEventListener('click', closeDropdown);

    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);

  function addDataFromList(id, name) {
    if (!selectedData.includes(id)) {
      setSelectedData([...selectedData, id]);
      setSelectedName([...selectedName, name]);
      onChangeOTI([...selectedData, id]);
    }
    setFilteredData([]);
    inputReset();
  }

  function rmDataFromList(e, key) {
    const rmList = selectedData.filter((_, i) => i !== key);
    setSelectedData(rmList);
    onChangeOTI(rmList);
    setSelectedName(selectedName.filter((_, i) => i !== key));
  }

  function inputReset() {
    setIsOpen(false);
    inputRef.current.value = '';
  }

  return (
    <>
      <div className={styles.inputWrapper}>
        {dataList ? (
          <div
            ref={contentRef}
            className={`${styles.content} ${isOpen ? styles.open : ''}`}
          >
            <ul
              className="myList"
              id="oti-result-list"
              role="listbox"
              aria-expanded="true"
              aria-hidden="false"
            >
              {filteredData.length == 0
                ? notFoundLi
                : filteredData.map((val, i) => (
                    <li
                      className={`${
                        currentFocus === i ? 'autocomplete-active' : ''
                      }`}
                      key={i}
                      onClick={() => addDataFromList(val.id, val.name)}
                    >
                      {val.name}
                    </li>
                  ))}
            </ul>
          </div>
        ) : (
          <></>
        )}

        <input
          type="text"
          name={inputName}
          ref={inputRef}
          className="myInput"
          onChange={searchData}
          onKeyDown={keyDownFn}
          role="searchbox"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          aria-autocomplete="list"
          aria-controls="oti-result-list"
        />
      </div>
      {selectedName.length > 0 ? (
        <div className={`${styles.tagContainer} mg-top-7`}>
          <TagItem val={selectedName} rm={rmDataFromList} />
        </div>
      ) : (
        <></>
      )}
    </>
  );

  function searchData() {
    if (inputRef.current.value.trim() !== '') {
      const searchPattern = new RegExp(
        inputRef.current.value
          .trim()
          .split(' ')
          .map(term => `(?=.*${term})`)
          .join(''),
        'i'
      );

      setFilteredData(dataList.filter(s => s.name.match(searchPattern)));
      setIsOpen(true);
    } else {
      setFilteredData([]);
      setIsOpen(false);
    }
  }

  function keyDownFn(e) {
    let li;
    const key = e.which || e.keyCode;

    if (contentRef) li = contentRef?.current?.getElementsByTagName('li');

    if (key == keyCode.DOWN) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      if (filteredData.length > 0 && currentFocus < filteredData.length - 1)
        setCurrentFocus(currentFocus + 1);
    } else if (key == keyCode.UP) {
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      if (filteredData.length > 0 && currentFocus > 0)
        setCurrentFocus(currentFocus - 1);
    } else if (key == keyCode.ENTER) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (li) li[currentFocus]?.click();
      }
    } else if ([keyCode.TAB, keyCode.ESC, keyCode.RETURN].includes(key)) {
      inputReset();
    }
  }
}
