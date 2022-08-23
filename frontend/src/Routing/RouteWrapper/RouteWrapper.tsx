import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '../../store';
import viewsRoutes from '../../views/viewsRoutes';

type RouteWrapperProps = {
  path: string;
} & Record<string, unknown>;
/**
 * Wrapper for standard Route used to redirect user to ErrorView if any error has occured
 * @param param0
 * @returns
 */
export const RouteWrapper: React.FC<RouteWrapperProps> = ({
  path,

  children,
  ...rest
}) => {
  const isError = useSelector((state: RootState) => state.error.isError);

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
