import { AxiosError, AxiosResponse, Method } from 'axios';
import { useCallback, useState } from 'react';
import protectedApiClient from './axios';
import requestMethods from './requestMethods';

type useQueryArgs<T> = {
  isLoading: boolean;
  data: undefined | T;
  status: undefined | number;
  error: undefined | AxiosError;
  runQuery: (data?: unknown) => void;
};

export const useQuery = <T>(url: string, method: Method = requestMethods.GET): useQueryArgs<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<undefined | T>();
  const [status, setStatus] = useState<number>();
  const [error, setError] = useState<undefined | AxiosError>();

  const runQuery = useCallback(
    (payload?: unknown) => {
      const handleError = (error: AxiosError) => {
        setError(error);
        setIsLoading(false);
      };

      const handleSuccess = (res: AxiosResponse) => {
        setData(res.data);
        setStatus(res.status);
        setIsLoading(false);
      };

      setIsLoading(true);
      protectedApiClient({
        method: method,
        url: url,
        data: payload,
      })
        .then(handleSuccess)
        .catch(handleError);
    },
    [method, url, setIsLoading, setData, setStatus, setError]
  );

  return { isLoading, data, status, error, runQuery };
};
