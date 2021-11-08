/* eslint-disable no-console */
import { useState } from 'react';
import { FormPaper, LandingGraphic, LandingGrid, Sidebar } from './elements';
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
    <LandingGrid>
      <Sidebar>
        <FormPaper>{currentForm === 'login' ? loginForm : registerForm}</FormPaper>
      </Sidebar>
      <LandingGraphic />
    </LandingGrid>
  );
};
