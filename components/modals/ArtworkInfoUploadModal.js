import useModalHandler from '@/hooks/useModalHandler';
import styles from './ArtworkInfoUploadModal.module.scss';
import OutsideTagsInput from '@/parts/inputs/OutsideTagsInput';
import useSWR from 'swr';
import { fetcher } from '@/utils/RequestHelper';
import { useEffect, useRef, useState } from 'react';
import TagsInput from '@/parts/inputs/TagsInput';

export default function ArtworkInfoUploadModal({
  inputs,
  handleInputChange,
  handleSubmit,
  hasTitle,
  isReqSend
}) {
  // @param (modalName, id)
  // useModalHandler('artworkInfoUploadModal', 'openArtworkInfoUploadModal');
  useEffect(() => {
    // Get the modal
    var modal = document.getElementById('artworkInfoUploadModal');
    // element that closes the modal
    var span = document.getElementsByClassName(
      'close-artworkInfoUploadModal'
    )[0];
    // close
    span.addEventListener('click', function() {
      modal.style.display = 'none';
    });

    document.body.addEventListener('click', function(e) {
      if (e.target == modal) {
        modal.style.display = 'none';
      }
    });
  }, []);

  const closeRef = useRef();

  const { data } = useSWR('/api/staticdata', fetcher);
  // console.log(inputs);
  const onCheckboxChanges = e => {
    const { value, checked } = e.target;

    if (checked) {
      inputs.mediums = [...inputs.mediums, parseInt(value)];
    } else {
      inputs.mediums = inputs.mediums.filter(e => e !== parseInt(value));
    }
  };

  function onChangeData(dataName, arr) {
    inputs[dataName] = arr;
  }

  return (
    <div id="artworkInfoUploadModal" className={`modal2 ${styles.filterModal}`}>
      <div className="modal-content3">
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <p>
              Upload Your Project<button>Clear All</button>
            </p>
            <span
              ref={closeRef}
              className="close-modal close-artworkInfoUploadModal"
            >
              &times;
            </span>
          </div>
          <div className={styles.body}>
            <form onSubmit={handleSubmit}>
              <div className={styles.container}>
                <div className={styles.content1}>
                  <div className="form-control">
                    <label htmlFor="email">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={inputs.title}
                      onChange={handleInputChange}
                      className="myInput"
                      autoComplete="off"
                      autoCorrect="off"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor="email">Softwares Used</label>
                    <OutsideTagsInput
                      inputName="softwares"
                      dataList={data?.softwares}
                      onChangeOTI={arr => onChangeData('softwares', arr)}
                    />
                  </div>
                </div>
                <div className={styles.content2}>
                  <div className="form-control">
                    <label htmlFor="topic">Topic</label>
                    <OutsideTagsInput
                      inputName="topic"
                      dataList={data?.topics}
                      onChangeOTI={arr => onChangeData('topics', arr)}
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor="tags">Tags</label>
                    <TagsInput
                      onChangeTags={arr => onChangeData('tags', arr)}
                    />
                  </div>
                </div>
              </div>

              <hr className={styles.divide} />

              <div>
                <div className="form-control">
                  <label htmlFor="mediums">Mediums</label>
                  <ul className={styles.checkboxSelectorWrapper}>
                    {data &&
                      data?.mediums.map((val, i) => {
                        return (
                          <li key={i}>
                            <span className={styles.checkboxSelector}>
                              <div className="d-flex align-center">
                                <input
                                  type="checkbox"
                                  value={val.id}
                                  name={`medium${i}`}
                                  id={`medium${i}`}
                                  onChange={onCheckboxChanges}
                                />
                                <label htmlFor={`medium${i}`}>{val.name}</label>
                              </div>
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>

              <hr className={styles.divide} />

              <div>
                <div className="form-control">
                  <label htmlFor="description">Description/ Details</label>
                  <textarea
                    name="description"
                    value={inputs.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="myTextarea"
                    placeholder="Your Description......."
                  />
                </div>
              </div>

              {!hasTitle && (
                <p className="defaultErrorMsg">Title Field is required!</p>
              )}

              <div className={styles.submit}>
                <button
                  type="button"
                  className="btn btn-white"
                  onClick={() => closeRef?.current?.click()}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isReqSend}
                  className="btn btn-green"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
