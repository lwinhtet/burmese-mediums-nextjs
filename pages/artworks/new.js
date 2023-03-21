import Head from 'next/head';
import { useState } from 'react';
import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import useForm from '@/hooks/useForm';
import MultiImgUploader from '@/parts/image-uploaders/MultiImgUploader';
import ThumbnailUploader from '@/parts/image-uploaders/ThumbnailUploader';
import styles from './new.module.scss';
import Portal from '@/hoc/Portal';
import ArtworkInfoUploadModal from '@/modals/ArtworkInfoUploadModal';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import router from 'next/router';
import {
  myToastContainer,
  toastError,
  toastInternetWarning,
  toastSuccess
} from '@/parts/toastify';
import { checkOnlineStatus } from '@/utils/CheckOnline';
import useCheckLogin from '@/hooks/useCheckLogin';

export default function ArtworkUploadPage() {
  const { auth } = useAuth();

  const initValue = {
    artworkFiles: [],
    thumbnailFile: null,
    title: '',
    description: '',
    softwares: [],
    topics: [],
    tags: [],
    mediums: []
  };
  const validationInit = {
    artworkFiles: true,
    thumbnailFile: true,
    title: true
  };

  const { inputs, setInputs, handleInputChange, handleSubmit } = useForm(
    saveArtwork,
    initValue
  );

  const [firstImg, setFirstImg] = useState();
  const [validation, setValidation] = useState(validationInit);
  const [isReqSend, setIsReqSend] = useState(false);

  const onContinue = () => {
    if (inputs.artworkFiles?.length === 0) {
      setValidation({ ...validation, artworkFiles: false });
      return;
    }
    if (!inputs.thumbnailFile) {
      setValidation({ ...validation, thumbnailFile: false });
      return;
    }

    modelAction('open');
  };

  const modelAction = action => {
    // Get the modal and open
    var model = document.getElementById('artworkInfoUploadModal');
    if (action === 'open') {
      model.style.display = 'block';
    } else {
      model.style.display = 'none';
    }
  };

  function updateFileList(newFiles = [], active = null) {
    inputs.artworkFiles = newFiles.filter((val, _) => val !== null);
    if (inputs.artworkFiles.length > 0)
      setValidation({ ...validation, artworkFiles: true });
    // if the first one is changed
    if (newFiles[0] && active === 0) {
      setFirstImg(URL.createObjectURL(newFiles[0]));
    }

    // if the first one is deleted
    if (!newFiles[0] && active === 0) {
      setFirstImg(null);
    }
  }

  function updateThumbnail(newFile = null) {
    if (newFile) setValidation({ ...validation, thumbnailFile: true });
    inputs.thumbnailFile = newFile;
  }

  async function saveArtwork() {
    const online = await checkOnlineStatus();
    if (online) {
      if (inputs.title === '')
        return setValidation({ ...validation, title: false });

      setValidation(validationInit);
      setIsReqSend(true);
      const body = new FormData();
      const filterBody = Object.keys(inputs).filter(
        key => key !== 'artworkFiles'
      );
      for (const key of filterBody) {
        body.append(key, inputs[key]);
      }
      for (const image of inputs.artworkFiles) {
        body.append('artworkFiles', image);
      }
      body.append('userId', auth.user.id);

      try {
        const res = await axios.post('/api/artworks', body, {
          withCredentials: true
        });
        if (res?.status === 200) {
          setIsReqSend(false);
          modelAction('close');
          setInputs(initValue);
          router.push('/');
          toastSuccess('Success: Artwork Created!');
        }
      } catch (error) {
        setIsReqSend(false);
        toastError('Failed: Something went wrong, Try Again Later!');
      }
    } else {
      toastInternetWarning();
    }
  }

  return (
    <>
      <Portal>
        <ArtworkInfoUploadModal
          inputs={inputs}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          hasTitle={validation.title}
          isReqSend={isReqSend}
        />
      </Portal>
      {myToastContainer()}
      <div className="container">
        <Head>
          <title>New Artwork</title>
        </Head>
        <div className={styles.header}>
          <div className={styles.highlight}></div>
          <div className={styles.actions}>
            <button
              // id="openArtworkInfoUploadModal"
              onClick={onContinue}
              className="btn btn-green"
            >
              Continue
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <MultiImgUploader
            updateFileList={updateFileList}
            hasArtworks={validation.artworkFiles}
          />
          <ThumbnailUploader
            firstImgBlob={firstImg ? firstImg : null}
            updateThumbnail={updateThumbnail}
            hasThumbnail={validation.thumbnailFile}
          />
        </div>
      </div>
    </>
  );
}

ArtworkUploadPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
