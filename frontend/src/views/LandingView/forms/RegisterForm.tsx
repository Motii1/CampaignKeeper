import { Container } from '@mui/material';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

export const RegisterForm: React.FC = () => (
  <Container sx={{ padding: '20px 0px' }}>
    <FormHeader text="REGISTER" />
    <LabeledTextInput text="Username" id="register-username" placeholder="8-12 characters" />
    <LabeledTextInput text="E-mail" id="register-email-1" placeholder="" />
    <LabeledTextInput text="Repeat email" id="register-email-2" placeholder="" />
    <LabeledPasswordInput text="Password" id="register-password-1" placeholder="" />
    <LabeledPasswordInput text="Repeat password" id="register-password-2" placeholder="" />
    <StandardButton text="Register" />
    <ChangeFormComponent
      firstLineText="Isn't your drunk face familiar?"
      secondLineText="Come here and..."
      buttonText="LOGIN"
    />
  </Container>
);
