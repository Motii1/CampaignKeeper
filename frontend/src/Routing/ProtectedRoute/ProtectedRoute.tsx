import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';
import protectedApiClient from '../../axios/axios';

type ProtectedRouteProps = {
  path: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  const [isAccessValid, setIsAccessValid] = useState(true);

  useEffect(() => {
    protectedApiClient.get('/api/user/status').then(response => {
      setIsAccessValid(response.status === 200);
    });
  }, []);

  return (
    <Route path={props.path} exact>
      {isAccessValid ? props.children : <Redirect to="/error" />}
    </Route>
  );
};