import { useState } from 'react';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';

export const LandingView: React.FC = () => {
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
