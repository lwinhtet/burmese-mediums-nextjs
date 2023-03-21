import { centerCrop, makeAspectCrop } from 'react-image-crop';

export function getCroppedImg(image, crop, filename) {
  //   800 800
  // 529 529
  // 11 1.5122873345935728 1.5122873345935728

  //   1920 1080
  // 443 249
  // 4.334085778781039 4.337349397590361

  // console.log(image, crop, filename);
  // console.log(image.naturalWidth, image.naturalHeight);
  // console.log(image.width, image.height);
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        blob.name = filename;
        resolve(blob);
      },
      'image/png',
      1
    );
  });
}

export function getCenterCrop(width, height) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100
      },
      4 / 3,
      // crop selection width & height
      width,
      height
    ),
    // make it center
    width,
    height
  );
}

export function generateDownload(blob) {
  const previewUrl = window.URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.download = 'cropPreview.png';
  anchor.href = URL.createObjectURL(blob);
  anchor.click();

  window.URL.revokeObjectURL(previewUrl);
}
