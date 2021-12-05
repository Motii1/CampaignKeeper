import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import protectedApiClient from '../../axios/axios';
import { updateAxiosError } from '../../axios/axiosErrorSlice';
import { RootState } from '../../store';
import viewsRoutes from '../../views/viewsRoutes';

type ProtectedAxiosRouteProps = {
  path: string;
};

export const ProtectedAxiosRoute: React.FC<ProtectedAxiosRouteProps> = props => {
  // eslint-disable-next-line no-console
  console.log('HERE');
  const [isAccessValid, setIsAccessValid] = useState(true);
  const isAxiosError = useSelector((state: RootState) => state.axiosErrorReducer.isError);
  const dispatch = useDispatch();

  useEffect(() => {
    protectedApiClient.get('/api/user/status').then(response => {
      setIsAccessValid(response.status === 200);
    });
  }, []);

  if (isAxiosError) return <Redirect to={viewsRoutes.ERROR} />;
  else if (isAccessValid)
    return (
      <Route path={props.path} exact>
        {props.children}
      </Route>
    );
  else {
    dispatch(updateAxiosError({ isError: true, status: 0, message: 'Unauthorized access' }));
    return <Redirect to={viewsRoutes.ERROR} />;
  }
};
