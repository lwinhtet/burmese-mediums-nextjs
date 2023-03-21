import { useRef, useState, useEffect } from 'react';
import TagItem from '../tags/TagItem';
import styles from './TagsInput.module.scss';

export default function TagsInput({ onChangeTags }) {
  const inputRef = useRef();
  const [tags, setTags] = useState([]);
  const [hasFocus, setFocus] = useState(false);

  useEffect(() => {
    const input = inputRef.current;
    const onEnter = e => {
      // If the user presses the "Enter" key on the keyboard
      if (e.key === 'Enter') {
        e.preventDefault();

        if (inputRef?.current?.innerHTML.trim() !== '') {
          setTags([...tags, inputRef.current.innerHTML.trim()]);
          onChangeTags([...tags, inputRef.current.innerHTML.trim()]);
          inputRef.current.innerHTML = '';
        }
      }
    };

    input.addEventListener('keypress', onEnter);

    return () => input.removeEventListener('keypress', onEnter);
  });

  function removeTag(e, key) {
    e.stopPropagation();
    const rmList = tags.filter((_, i) => i !== key);
    setTags(rmList);
    onChangeTags(rmList);
    inputRef.current.focus();
  }

  return (
    <div
      className={`${styles.inputWrapper} ${hasFocus ? 'hasFocus' : ''}`}
      onClick={() => inputRef.current.focus()}
    >
      <div className={styles.tagWrapper}>
        <TagItem val={tags} rm={removeTag} />
        <span
          ref={inputRef}
          className={styles.tagsInput}
          role="textbox"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoComplete="off"
        ></span>
      </div>
    </div>
  );
}
