import useSWR from 'swr';

// const fetcher = url => fetch(url).then(res => res.json());
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useSoftware() {
  const { data, error, isLoading } = useSWR('/api/staticdata', fetcher);

  return {
    softwares: data,
    isLoading,
    isError: error
  };
}
