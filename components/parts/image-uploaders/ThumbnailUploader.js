import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg, getCenterCrop } from '@/utils/getCropImage';
import CropModal from '@/modals/CropModal';
import Portal from '@/hoc/Portal';
import styles from './ThumbnailUploader.module.scss';

export default function ThumbnailUploader({
  firstImgBlob = null,
  updateThumbnail,
  hasThumbnail
}) {
  const inputRef = useRef();
  const hiddenImgEl = useRef();
  const previewImgEl = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [hasUploadPhoto, setHasUploadPhoto] = useState(false);
  const [crop, setCrop] = useState();
  const [initCrop, setInitCrop] = useState(null);
  const [isCropped, setIsCropped] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (initCrop) {
      if (
        hiddenImgEl.current.naturalWidth < 400 &&
        hiddenImgEl.current.naturalWidth < 400
      ) {
        if (selectedFile || firstImgBlob) {
          setIsError('Image sizes must be equal or higher than 400px !');
        }
        rmPreviewImg();
        return;
      }

      async function fetchCropImg() {
        // crop img from temp img
        const blobImg = await getCroppedImg(
          hiddenImgEl.current,
          initCrop,
          'avatar'
        );

        const url = URL.createObjectURL(blobImg);
        setIsCropped(true);
        setSelectedFile(url);
        updateThumbnail(new File([blobImg], 'avatar'));
      }
      fetchCropImg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCrop]);

  useEffect(() => {
    if (!hasUploadPhoto) {
      // always rm when no uploaded photo
      rmPreviewImg();
      setIsError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstImgBlob]);

  useEffect(() => {
    return function cleanup() {
      if (originalFile) URL.revokeObjectURL(originalFile);
      if (selectedFile) URL.revokeObjectURL(selectedFile);
    };
  });

  useEffect(() => {
    if (!hasThumbnail) {
      setIsError('Cover Photo is required!');
    }
  }, [hasThumbnail]);

  const uploadFile = e => {
    rmPreviewImg();
    setIsError(null);
    const blobLink = URL.createObjectURL(e.target.files[0]);
    setOriginalFile(blobLink);
    setSelectedFile(blobLink);
    setHasUploadPhoto(true);
  };

  const clickedUploader = e => {
    e.preventDefault();
    // It's normal if your file is prefixed with 'C:\fakepath'.
    // That's a security feature preventing JavaScript from knowing the file's absolute path.
    // The browser still knows it internally.
    inputRef.current.value = null;
    inputRef.current.click();
  };

  const rmThumbnailFile = () => {
    if (selectedFile) {
      setSelectedFile(null);
      setOriginalFile(null);
      rmPreviewImg();
    }
  };

  const rmPreviewImg = () => {
    setCrop(undefined); // Makes crop preview update between images. Resetting onComplete
    setIsCropped(false);
    setSelectedFile(null);
    setOriginalFile(null);
    setHasUploadPhoto(false);
    updateThumbnail(null);
  };

  const appendHiddenImg = () => {
    const onImageLoad = e => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
      const c = getCenterCrop(width, height); // 800 800
      setCrop(c);
    };

    if (selectedFile || firstImgBlob ? true : false) {
      return (
        <div className={styles.imgContainer}>
          <ReactCrop
            crop={crop}
            onComplete={c => setInitCrop(c)}
            aspect={4 / 3}
            disabled={true}
          >
            {/* <Image
              src={selectedFile ? selectedFile : firstImgBlob}
              onLoad={onImageLoad}
              ref={hiddenImgEl}
              alt="image"
              width={400}
              height={300}
            /> */}
            <img
              src={selectedFile ? selectedFile : firstImgBlob}
              onLoad={onImageLoad}
              ref={hiddenImgEl}
              alt="image"
            />
          </ReactCrop>
        </div>
      );
    }
  };

  const updateCroppedImgFromModalBox = blobFileImg => {
    if (previewImgEl) {
      const url = URL.createObjectURL(blobFileImg);
      previewImgEl.current.onload = function() {
        URL.revokeObjectURL(this.src); // clean-up memory
      };
      previewImgEl.current.src = url;
      setSelectedFile(url);
      updateThumbnail(new File([blobFileImg], 'avatar'));
    }
  };

  return (
    <>
      <Portal>
        <CropModal
          image={
            originalFile ? originalFile : firstImgBlob ? firstImgBlob : null
          }
          updateCroppedImg={updateCroppedImgFromModalBox}
        />
      </Portal>
      <div className={styles.tn}>
        <input
          ref={inputRef}
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          className={styles.imgInput}
          onChange={uploadFile}
        />
        <div className={styles.subheader}>Cover Photo</div>
        {isError && <div className="defaultErrorMsg">{isError}</div>}
        <div className={styles.tnContainer}>
          <div
            className={`${styles.tnPlaceholder} u-4-3-ratio`}
            id="preview"
            onClick={clickedUploader}
          >
            {selectedFile && isCropped && (
              <Image
                src={selectedFile}
                className={styles.thumbnailImg}
                ref={previewImgEl}
                alt="Cropped Image"
                fill
              />
            )}
          </div>

          <div className={styles.actions}>
            <button
              className="btn btn-white"
              id="openCropModal"
              disabled={selectedFile === null}
            >
              Crop
            </button>
            <button
              className="btn btn-white"
              onClick={rmThumbnailFile}
              disabled={!hasUploadPhoto}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className={styles.tempImg}>{appendHiddenImg()}</div>
    </>
  );
}
