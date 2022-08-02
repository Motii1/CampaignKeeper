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
  resetQuery: () => void;
};

/**
 * Custom React hook used to performe queries to server through the application.
 * Requires url to query, query method and optional headers for the query.
 * Provides developers with information about query execution status (loading/loaded),
 * response status (http), error (if occurs), data returned in response (if any)
 * and methods for running the query and reseting it (so it can be run again)
 * @param url
 * @param method
 * @param headers
 * @returns
 */
export const useQuery = <T>(
  url: string,
  method: Method = requestMethods.GET,
  headers: null | AxiosRequestHeaders = null
): useQueryArgs<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<undefined | T>();
  const [status, setStatus] = useState<undefined | number>();
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

  const resetQuery = () => {
    setIsLoading(false);
    setData(undefined);
    setStatus(undefined);
    setError(undefined);
  };

  return { isLoading, data, status, error, runQuery, resetQuery };
};
