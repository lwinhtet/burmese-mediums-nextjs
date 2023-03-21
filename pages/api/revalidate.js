export default async function handler(req, res) {
  const { secret, page, id } = req.query;
  // Check for secret to confirm this is a valid request
  if (secret !== process.env.MY_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (!page && !id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(`/${page}/${id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
// http://localhost:3000/api/revalidate?page=artworks&id=R7YpC8f41K&secret=my-lwin-8597-htet-thu-revalidate-key-ultra-long-secret
// http://localhost:3000/api/revalidate?page=portfolios&id=lwinhtetthu12323&secret=my-lwin-8597-htet-thu-revalidate-key-ultra-long-secret
