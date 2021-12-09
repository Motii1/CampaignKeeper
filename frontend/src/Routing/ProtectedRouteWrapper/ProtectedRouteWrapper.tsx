import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import protectedApiClient from '../../axios/axios';
import { updateError } from '../../views/ErrorView/errorSlice';
import { RouteWrapper } from '../RouteWrapper/RouteWrapper';

type ProtectedRouteWrapperProps = {
  path: string;
} & Record<string, unknown>;

export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  path,
  children,
  ...rest
}) => {
  const [isAccessValid, setIsAccessValid] = useState(false);
  const [isFetchingFinished, setIsFetchingFinished] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    protectedApiClient.get('/api/user/status').then(response => {
      setIsAccessValid(response.status === 200);
      setIsFetchingFinished(true);
    });
  }, []);

  if (!isFetchingFinished) return <></>;
  else if (!isAccessValid)
    dispatch(updateError({ isError: true, message: 'You are not authorized to access this page' }));

  return (
    <RouteWrapper path={path} {...rest}>
      {children}
    </RouteWrapper>
  );
};
