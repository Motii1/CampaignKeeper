import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '../../axios/useQuery';
import { updateError } from '../../views/ErrorView/errorSlice';
import { LoadingView } from '../../views/LoadingView/LoadingView';
import { RouteWrapper } from '../RouteWrapper/RouteWrapper';

type ProtectedRouteWrapperProps = {
  path: string;
} & Record<string, unknown>;

export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  path,
  children,
  ...rest
}) => {
  const [isAccessValid, setIsAccessValid] = useState(true);
  const [wasAccessChecked, setWasAccessChecked] = useState(false);
  const dispatch = useDispatch();

  // handles status query
  const { isLoading, status, runQuery } = useQuery('/api/user/status');

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  useEffect(() => {
    if (!isLoading && status) {
      setWasAccessChecked(true);
      setIsAccessValid(status === 200);
    }
  }, [isLoading, status]);

  if (isLoading || !wasAccessChecked) return <LoadingView />;
  else if (!isLoading && !isAccessValid)
    dispatch(updateError({ isError: true, message: 'Unauthorized access' }));

  return (
    <RouteWrapper path={path} {...rest}>
      {children}
    </RouteWrapper>
  );
};
