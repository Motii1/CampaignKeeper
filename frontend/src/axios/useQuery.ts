import { AxiosError, AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import { useCallback, useState } from 'react';
import protectedApiClient from './axios';
import requestMethods from './requestMethods';

type useQueryArgs<T> = {
  isLoading: boolean;
  data: undefined | T;
  status: undefined | number;
  error?: AxiosError;
  runQuery: (data?: unknown) => void;
};

export const useQuery = <T>(
  url: string,
  method: Method = requestMethods.GET,
  headers: null | AxiosRequestHeaders = null
): useQueryArgs<T> => {
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
        headers: headers ? headers : undefined,
      })
        .then(handleSuccess)
        .catch(handleError);
    },
    [method, url, headers, setIsLoading, setData, setStatus, setError]
  );

  return { isLoading, data, status, error, runQuery };
};
