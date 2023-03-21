import Image from 'next/image';
import { useState, useEffect } from 'react';

const ImageWithFallback = ({
  fallback = '/img/default.png',
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
