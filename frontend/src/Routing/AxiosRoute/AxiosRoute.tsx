import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '../../store';
import viewsRoutes from '../../views/viewsRoutes';

type AxiosRouteProps = {
  path: string;
};

export const AxiosRoute: React.FC<AxiosRouteProps> = props => {
  const isAxiosError = useSelector((state: RootState) => state.axiosErrorReducer.isError);

  if (isAxiosError) return <Redirect to={viewsRoutes.ERROR} />;
  return (
    <Route path={props.path} exact>
      {props.children}
    </Route>
  );
};
