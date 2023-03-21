import PrimaryLayout from '@/layouts/primary/PrimaryLayout';
import styles from './my-profile.module.scss';
import CropModal from '@/modals/CropModal';
import Portal from '@/hoc/Portal';
import { svgIcon } from '@/utils/Helper';
import ImageWithFallback from '@/utils/ImageWithFallback';
import { getProfileImage } from '@/utils/RequestHelper';
import { useEffect, useRef, useState } from 'react';
import useForm from '@/hooks/useForm';
import axios from 'axios';
import {
  myToastContainer,
  toastSuccess,
  toastError,
  toastInternetWarning
} from '@/parts/toastify';
import { checkOnlineStatus } from '@/utils/CheckOnline';

export default function MyProfilePage({ myUser }) {
  const pageTags = [
    {
      id: '1',
      name: 'Profile',
      value: 'profile',
      icon: 'icon-user1'
    },
    {
      id: '2',
      name: 'Account',
      value: 'account',
      icon: 'icon-cog'
    },
    {
      id: '3',
      name: 'Portfolio',
      value: 'portfolio',
      icon: 'icon-suitcase'
    },
    {
      id: '4',
      name: 'Job Resume',
      value: 'resume',
      icon: 'icon-document-landscape'
    },
    {
      id: '5',
      name: 'Change Password',
      value: 'change-password',
      icon: 'icon-lock'
    },
    {
      id: '6',
      name: 'Change URL Nickname',
      value: 'change-url',
      icon: 'icon-lock'
    }
  ];
  const [user, setUser] = useState(myUser);
  const initValue = {
    name: user.name,
    profession: user.profession ? user.profession : '',
    city: user.city ? user.city : '',
    country: user.country ? user.country : '',
    photo: user.photo ? user.photo : null
  };

  const [activeTag, setActiveTag] = useState('profile');
  const [originalBlob, setOriginalBlob] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [isValidationError, setIsValidationError] = useState(null);
  const [isReqSend, setIsReqSend] = useState(false);
  const profileImgRef = useRef();
  // const [calledPush, setCalledPush] = useState(false);
  // console.log(333444);
  // if (calledPush) return;
  // setCalledPush(true);
  useEffect(() => {
    return function cleanup() {
      if (originalBlob) URL.revokeObjectURL(originalBlob);
      if (photoBlob) URL.revokeObjectURL(photoBlob);
    };
  });

  const saveProfile = async () => {
    const online = await checkOnlineStatus();
    if (online) {
      if (inputs.name === '')
        return setIsValidationError('Name field is required');

      setIsReqSend(true);
      const body = new FormData();

      for (const key of Object.keys(inputs)) {
        if (inputs[key] !== null) {
          body.append(key, inputs[key]);
        }
      }

      body.append('userId', user.id);

      try {
        const res = await axios.post('/api/profile', body, {
          withCredentials: true
        });
        if (res?.status === 200) {
          setIsReqSend(false);
          const newData = res.data.user;
          setUser(newData);
          toastSuccess('Success: User Updated!');
        }
      } catch (error) {
        setIsReqSend(false);
        toastError('Failed: Something went wrong, Try Again Later!');
      }
    } else {
      toastInternetWarning();
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    saveProfile,
    initValue
  );

  const clickedUploader = e => {
    e.preventDefault();
    profileImgRef.current.value = null;
    profileImgRef.current.click();
  };

  const uploadFile = e => {
    const file = e.target.files[0];
    setPhotoBlob(URL.createObjectURL(file));
    setOriginalBlob(URL.createObjectURL(file));
    URL.revokeObjectURL(photoBlob);
    inputs.photo = file;
  };

  const profileSettings = () => {
    return (
      <div className="profileSettings">
        <h1 className="pageHeader">Profile</h1>
        <div className={styles.details}>
          <h3>Basic</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={`form-control ${styles.formControl}`}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleInputChange}
                  className="myInput"
                  autoComplete="off"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className={`form-control ${styles.formControl}`}>
                <label htmlFor="name">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={inputs.profession}
                  onChange={handleInputChange}
                  className="myInput"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
            </div>
            <div className={styles.formContainer}>
              <div className={`form-control ${styles.formControl}`}>
                <label htmlFor="name">City</label>
                <input
                  type="text"
                  name="city"
                  value={inputs.city}
                  onChange={handleInputChange}
                  className="myInput"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
              <div className={`form-control ${styles.formControl}`}>
                <label htmlFor="name">Country</label>
                <input
                  type="text"
                  name="country"
                  value={inputs.country}
                  onChange={handleInputChange}
                  className="myInput"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
            </div>
            <div className={styles.photo}>
              <div className={styles.photoContainer}>
                <ImageWithFallback
                  src={
                    photoBlob
                      ? photoBlob
                      : getProfileImage(user?.photo ? user?.photo : null)
                  }
                  alt="Profile Photo"
                  fallback="/img/default.png"
                  width={96}
                  height={96}
                  className={styles.image}
                  priority={true}
                />
                {/* <div className={!photoBlob ? styles.cropBtnContainer : ''}> */}

                {/* </div> */}
                <button
                  type="button"
                  id="openCropModal"
                  disabled={!photoBlob}
                  className={`${styles.cropIcon} ${
                    !photoBlob ? styles.cropBtnContainer : ''
                  }`}
                >
                  {svgIcon('icon-crop', styles.crop)}
                </button>
              </div>

              <div className={styles.imgUploadBtnContainer}>
                <input
                  type="file"
                  ref={profileImgRef}
                  accept=".jpg,.jpeg,.png,.gif"
                  className="d-none"
                  onChange={e => uploadFile(e)}
                />
                <button
                  type="button"
                  onClick={clickedUploader}
                  className="btn btn-white"
                >
                  Upload Photo
                </button>
                {/* <div className={!photoBlob ? styles.cropBtnContainer : ''}>
                  <button
                    type="button"
                    disabled={!photoBlob}
                    className="btn btn-white"
                    id="openCropModal"
                  >
                    Crop
                  </button>
                </div> */}
                <div className={!photoBlob ? styles.cropBtnContainer : ''}>
                  <button
                    type="button"
                    disabled={!photoBlob}
                    className="btn btn-white"
                    onClick={() => setPhotoBlob(null)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {isValidationError && (
              <p className="defaultErrorMsg">{isValidationError}</p>
            )}
            <div className={styles.submitBtnContainer}>
              <button
                type="submit"
                disabled={isReqSend}
                className="btn btn-green"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const accountSettings = () => {
    return (
      <div className="accountSettings">
        <h1 className="pageHeader">Account</h1>
        <div className={styles.details}></div>
      </div>
    );
  };

  const portfolioSettings = () => {
    return (
      <div className="portfolioSettings">
        <h1 className="pageHeader">Portfolio</h1>
        <div className={styles.details}></div>
      </div>
    );
  };

  const resumeSettings = () => {
    return (
      <div className="resumeSettings">
        <h1 className="pageHeader">Resume</h1>
        <div className={styles.details}></div>
      </div>
    );
  };

  const changePwdSettings = () => {
    return (
      <div className="changePassword">
        <h1 className="pageHeader">Change Your Password</h1>
        <div className={styles.details}></div>
      </div>
    );
  };

  const updateCroppedImgFromModalBox = blobFileImg => {
    const url = URL.createObjectURL(blobFileImg);
    setPhotoBlob(url);
    inputs.photo = new File([blobFileImg], 'avatar');
  };

  return (
    <div className={styles.container}>
      <Portal>
        <CropModal
          image={originalBlob ? originalBlob : null}
          updateCroppedImg={updateCroppedImgFromModalBox}
          isSquare={true}
        />
      </Portal>
      {myToastContainer()}
      <div className={styles.sideBar}>
        <div className={styles.sideProfile}>
          <ImageWithFallback
            src={getProfileImage(user?.photo ? user?.photo : null)}
            // 'user-1.jpg'
            alt="Profile Photo"
            fallback="/img/default.png"
            width={55}
            height={55}
            className={styles.image}
            priority={true}
          />
          <p className={styles.name}>{user.name}</p>
          {/* <p>Member since 24th March</p> */}
        </div>
        <div className={`${styles.list}`}>
          <ul>
            {pageTags.map(tag => {
              return (
                <li
                  key={tag.id}
                  onClick={() => setActiveTag(tag.value)}
                  className={activeTag === tag.value ? styles.active : ''}
                >
                  <div className="d-flex align-center">
                    {svgIcon(tag.icon, styles.icon)}
                    <p className={styles.text}>{tag.name}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={styles.content}>
        {activeTag === 'profile' && profileSettings()}
        {activeTag === 'account' && accountSettings()}
        {activeTag === 'portfolio' && portfolioSettings()}
        {activeTag === 'resume' && resumeSettings()}
        {activeTag === 'change-password' && changePwdSettings()}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  let errorCode = null;
  const res = await axios
    .get('http://127.0.0.1:8080/api/v1/users/me', {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    })
    .catch(error => {
      if (error.response.data.error.statusCode === 401) errorCode = true;
    });

  if (errorCode) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false
      }
    };
  }

  // if (res.data.data.data) {
  //   return {
  //     notFound: true
  //   };
  // }

  return { props: { myUser: res.data.data.data } };
}

MyProfilePage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
