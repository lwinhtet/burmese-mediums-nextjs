export const checkOnlineStatus = async () => {
  try {
    const online = await fetch('/online.json', { cache: 'no-store' });
    return online.status >= 200 && online.status < 300; // either true or false
  } catch (err) {
    return false; // definitely offline
  }
};
