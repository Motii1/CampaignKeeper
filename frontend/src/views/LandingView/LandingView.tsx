import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import viewsRoutes from '../viewsRoutes';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';

export const LandingView: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);
  const history = useHistory();
  if (userState.isDownloaded) history.push(viewsRoutes.START);

  const [currentForm, setCurrentForm] = useState('login');
  const loginForm = (
    <LoginForm
      onChangeForm={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCurrentForm('register');
      }}
    />
  );
  const registerForm = (
    <RegisterForm
      onChangeForm={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCurrentForm('login');
      }}
    />
  );

  return (
    <ViewWithSidebarWrapper>
      {currentForm === 'login' ? loginForm : registerForm}
    </ViewWithSidebarWrapper>
  );
};
