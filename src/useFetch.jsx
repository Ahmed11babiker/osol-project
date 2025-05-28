import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPadding, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw Error('could not fetch the data');
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            setIsPending(false);
            setError(err.message);
          }
        });
    }, 1000);

    // Cleanup function to abort the fetch if component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, isPadding, error };
};

export default useFetch;
