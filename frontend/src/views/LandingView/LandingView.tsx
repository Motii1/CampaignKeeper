import { useState } from 'react';
import { FormPaper, LandingGraphic, LandingGrid, Sidebar } from './elements';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';

export const LandingView: React.FC = () => {
  const changeForm = () => {
    if (currentForm.name === 'login')
      setCurrentForm({
        name: 'register',
        component: <RegisterForm onChangeForm={changeForm} />,
      });
    else
      setCurrentForm({
        name: 'login',
        component: <LoginForm onChangeForm={changeForm} />,
      });
  };

  const [currentForm, setCurrentForm] = useState({
    name: 'login',
    component: <LoginForm onChangeForm={changeForm} />,
  });

  return (
    <LandingGrid>
      <Sidebar>
        <FormPaper>{currentForm.component}</FormPaper>
      </Sidebar>
      <LandingGraphic />
    </LandingGrid>
  );
};
