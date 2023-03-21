/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react';
import useModalHandler from '@/hooks/useModalHandler';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '@/utils/getCropImage';
import styles from './CropModal.module.scss';

export default function CropModal({
  image,
  updateCroppedImg,
  isSquare = false
}) {
  useModalHandler('cropModal', 'openCropModal');
  const htmlImgRef = useRef();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const onImageLoad = e => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const c = getCenterCrop(width, height);
    setCrop(c);
  };

  const getCenterCrop = (width, height) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100
        },
        isSquare ? 1 / 1 : 4 / 3,
        // crop selection width & height
        width,
        height
      ),
      // make it center
      width,
      height
    );
  };

  const cropImage = async () => {
    const blobFileImg = await getCroppedImg(
      htmlImgRef.current,
      completedCrop,
      'avatar'
    );
    updateCroppedImg(blobFileImg);
    var close = document.getElementsByClassName('close-cropModal')[0];
    close.click();
  };

  return (
    <div id="cropModal" className="modal">
      <div className="modal-content">
        <div className={styles.header}>
          <p>{isSquare ? 'Create Profile Photo' : 'Create Thumbnail'}</p>
          <span className="close-modal close-cropModal">&times;</span>
        </div>
        {image && (
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            className={styles.imgContainer}
            aspect={isSquare ? 1 / 1 : 4 / 3}
            minWidth={isSquare ? 96 : 200}
            minHeight={isSquare ? 96 : 150}
            onComplete={c => setCompletedCrop(c)}
            keepSelection={true}
            ruleOfThirds={true}
          >
            <img
              ref={htmlImgRef}
              src={image}
              className={styles.cropImg}
              onLoad={onImageLoad}
              alt="My Artwork"
            />
          </ReactCrop>
        )}

        <div>
          <button
            type="button"
            className="btn btn-white"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={cropImage}
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}
