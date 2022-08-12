import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import viewsRoutes from '../viewsRoutes';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';

/**
 * Component responsible for display and operations of landing page (login/register)
 * @returns
 */
export const LandingView: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);
  const history = useHistory();

  useEffect(() => {
    if (userState.isDownloaded) history.push(viewsRoutes.START);
  }, [history, userState.isDownloaded]);

  const [currentForm, setCurrentForm] = useState('login');

  return (
    <ViewWithSidebarWrapper>
      {currentForm === 'login' ? (
        <LoginForm
          onChangeForm={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setCurrentForm('register');
          }}
        />
      ) : (
        <RegisterForm
          onChangeForm={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setCurrentForm('login');
          }}
        />
      )}
    </ViewWithSidebarWrapper>
  );
};
