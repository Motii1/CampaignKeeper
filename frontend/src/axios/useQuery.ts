import { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import protectedApiClient from './axios';

type useQueryArgs<T> = {
  isLoading: boolean;
  data: undefined | T;
  status: number;
  error: undefined | AxiosError;
  runQuery: (data: unknown) => void;
};

export const useQuery = <T>(url: string): useQueryArgs<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<undefined | T>();
  const [status, setStatus] = useState<number>(0);
  const [error, setError] = useState<undefined | AxiosError>();

  const handleError = (error: AxiosError) => {
    setError(error);
    setIsLoading(false);
  };

  const runQuery = useCallback(
    (payload: unknown) => {
      const handleSuccess = (res: AxiosResponse) => {
        setData(res.data);
        setStatus(res.status);
        setIsLoading(false);
      };

      setIsLoading(true);
      protectedApiClient.post(url, payload).then(handleSuccess).catch(handleError);
    },
    [url]
  );

  return { isLoading, data, status, error, runQuery };
};
