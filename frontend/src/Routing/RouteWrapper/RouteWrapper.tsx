import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '../../store';
import viewsRoutes from '../../views/viewsRoutes';

type RouteWrapperProps = {
  path: string;
} & Record<string, unknown>;

export const RouteWrapper: React.FC<RouteWrapperProps> = ({ path, children, ...rest }) => {
  const isError = useSelector((state: RootState) => state.errorReducer.isError);

  if (isError)
    return (
      <Route {...rest}>
        <Redirect to={viewsRoutes.ERROR} />
      </Route>
    );
  return (
    <Route path={path} exact {...rest}>
      {children}
    </Route>
  );
};
