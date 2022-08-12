import { Location } from 'history';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { useQuery } from '../../axios/useQuery';
import { setError } from '../../views/ErrorView/errorSlice';
import { LoadingView } from '../../views/LoadingView/LoadingView';
import viewsRoutes from '../../views/viewsRoutes';
import { RouteWrapper } from '../RouteWrapper/RouteWrapper';

type ProtectedRouteWrapperProps = {
  path: string;
  location?: Location;
} & Record<string, unknown>;

/**
 * Wrapper on our custom RouteWrapper used to check if user has access
 * to requested route (that is: if user is logged in)
 * and throwing an error if user doesn't have access
 * @param param0
 * @returns
 */
export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  path,
  location,
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
    dispatch(setError({ isError: true, message: 'Unauthorized access' }));

  // eslint-disable-next-line no-console
  console.log(location);
  if (location && path !== location.pathname)
    return (
      <Route {...rest}>
        <Redirect to={viewsRoutes.ERROR} />
      </Route>
    );

  return (
    <RouteWrapper path={path} {...rest}>
      {children}
    </RouteWrapper>
  );
};
