import { useEffect } from 'react';

export default function useModalHandler(modalId, modalOpener) {
  useEffect(() => {
    // Get the modal
    var modal = document.getElementById(modalId);
    // Get the button that opens the modal
    var btn = document.getElementById(modalOpener);
    // element that closes the modal
    var span = document.getElementsByClassName(`close-${modalId}`)[0];

    //open
    btn.addEventListener('click', function() {
      modal.style.display = 'block';
    });

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

  return;
}
