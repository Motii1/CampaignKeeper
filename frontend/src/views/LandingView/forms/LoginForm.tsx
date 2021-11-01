import { Container } from '@mui/material';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

export const LoginForm: React.FC = () => (
  <Container sx={{ padding: '20px 0px' }}>
    <FormHeader text="LOGIN" />
    <LabeledTextInput
      text="Email or username"
      id="login-username"
      placeholder="Name that cannot be spoken"
    />
    <LabeledPasswordInput
      text="Password"
      id="login-password"
      placeholder="Phrase that cannot be seen"
    />
    <StandardButton text="Login" />
    <ChangeFormComponent
      firstLineText="Are you new here, adventurer?"
      secondLineText="Rest here and..."
      buttonText="REGISTER"
    />
  </Container>
);
