import { FormPaper, LandingGraphic, LandingGrid, Sidebar } from './elements';
// import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';

export const LandingView: React.FC = () => (
  <LandingGrid>
    <Sidebar>
      <FormPaper>
        <RegisterForm />
      </FormPaper>
    </Sidebar>
    <LandingGraphic />
  </LandingGrid>
);
