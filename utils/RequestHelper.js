export const fetcher = (...args) => fetch(...args).then(res => res.json());

export const fetcherWithParams = url => {
  // console.log(111, `${url[0]}${url[1]}`);
  return fetch(`${url[0]}${url[1]}`).then(res => res.json());
};

export const fetcherParsed = async (...args) =>
  await fetch(...args).then(res => res.json());

export const headerCookie = req => {
  return {
    headers: {
      Cookie: req.headers.cookie
    },
    withCredentials: true
  };
};

export const getThumbnailImage = name => {
  return `/img/thumbnails/${name}`;
};

export const getAssetsImage = name => {
  return `/img/artworks/${name}`;
};

export const getProfileImage = (name = null) => {
  if (name) {
    const domains = [
      'storage.googleapis.com',
      'lh1.googleusercontent.com',
      'lh2.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com'
    ];

    if (isValidUrl(name)) {
      const { hostname } = new URL(name);
      if (domains.includes(hostname)) return name;
    }
    // return `/img/users/${name}`;
    return `/img/users/${name}`;
  }
  return '/img/users/default.png';
};

const isValidUrl = urlString => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
