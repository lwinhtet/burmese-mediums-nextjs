import { svgIcon } from '@/utils/Helper';
import Image from 'next/image';
import { useState, useRef } from 'react';
import styles from './MultiImgUploader.module.scss';

// https://dev.to/collegewap/how-to-delete-an-item-from-the-state-array-in-react-kl
// https://stackoverflow.com/questions/30864573/what-is-a-blob-url-and-why-it-is-used
// https://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
// Note that URL may be prefixed in webkit-browsers, so use:
// var url = (URL || webkitURL).createObjectURL(...);

export default function MultiImgUploader({ updateFileList, hasArtworks }) {
  const imgInputRef = useRef();
  const [active, setActive] = useState(0);
  const [select, setSelect] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([
    { file: null, url: null },
    { file: null, url: null },
    { file: null, url: null }
  ]);

  const uploadFile = e => {
    const file = e.target.files[0];
    let arr = [...selectedFiles];
    arr[active].file = file;
    arr[active].url = URL.createObjectURL(file);
    setSelectedFiles(arr);
    sendBackUpdatedList(arr, active);
    setSelect(active);
  };

  // need to send back key to know that the first is changed?
  const sendBackUpdatedList = (arr, activeKey) => {
    let list = [];
    arr.map((obj, _) => {
      list.push(obj.file);
    });
    updateFileList(list, activeKey);
  };

  const deleteImgFile = (e, key) => {
    e.stopPropagation();
    let arr = [...selectedFiles];
    URL.revokeObjectURL(arr[key]?.url);
    arr[key] = { url: null, file: null };
    // arr[key].file = null;
    setSelectedFiles(arr);
    sendBackUpdatedList(arr, key);
  };

  const clickedUploader = (e, key) => {
    e.preventDefault();
    // It's normal if your file is prefixed with 'C:\fakepath'.
    // That's a security feature preventing JavaScript from knowing the file's absolute path.
    // The browser still knows it internally.
    imgInputRef.current.value = null;
    setActive(key);
    imgInputRef.current.click();
  };

  const smImagePlaceholder = key => {
    return (
      <div
        key={key}
        className={styles.smImageContainer}
        onClick={e => clickedUploader(e, key)}
      >
        <div className={`${styles.smImage} u-4-3-ratio`}>
          <span className={`${styles.smImageContent} u-center`}>
            {svgIcon('icon-upload', styles.rmUploadButton)}
          </span>
        </div>
      </div>
    );
  };

  const smImage = (key, url) => {
    return (
      <div key={key} className={styles.smImageContainer}>
        <div
          className={`${styles.smImage} u-4-3-ratio`}
          onClick={() => {
            setSelect(key);
            setActive(key);
          }}
        >
          <Image src={url} alt="artwork" className={styles.image} fill />
          <svg
            className={styles.rmImgButton}
            onClick={e => deleteImgFile(e, key)}
          >
            <use xlinkHref="/img/icomoon/sprite.svg#icon-circle-with-cross"></use>
          </svg>

          <div className={styles.overlayRmImgButton}></div>
        </div>
        {select === key && <div className={styles.selected}></div>}
      </div>
    );
  };

  const showSmImage = () => {
    return selectedFiles.map((file, i) => {
      if (file.url) {
        return smImage(i, file.url);
      } else {
        return smImagePlaceholder(i);
      }
    });
  };

  return (
    <div className={`${styles.artwork}`}>
      <div className={styles.artworkContainer}>
        <div className={styles.subheader}>Your Works</div>
        <input
          ref={imgInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          className={styles.imgInput}
          onChange={uploadFile}
        />
        {!hasArtworks && (
          <div className="defaultErrorMsg">At least one asset is required!</div>
        )}
        <div
          className={`${styles.bigImageContainer} u-4-3-ratio`}
          onClick={e => clickedUploader(e, active)}
        >
          {selectedFiles[select]?.url ? (
            <Image
              src={selectedFiles[select].url}
              fill
              alt="Upload Image"
              className={styles.bigImage}
            />
          ) : (
            <div className={`${styles.placeholder} u-center`}>
              <span>Upload Images in .png, .jpeg, .gif</span>
            </div>
          )}
        </div>
        <div className="d-flex">{showSmImage()}</div>
      </div>
    </div>
  );
}
