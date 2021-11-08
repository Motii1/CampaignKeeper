import { Stack } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from '../../../services/auth/authServices';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

type FormProps = {
  onChangeForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

type TextFieldState = {
  value: string;
  error: boolean;
  helperText: string;
};

export const RegisterForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const usernameRegex = /^(?=.{8,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,255}$/;

  const [username, setUsername] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [email, setEmail] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [emailRepeat, setEmailRepeat] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [password, setPassword] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [passwordRepeat, setPasswordRepeat] = useState({
    value: '',
    error: false,
    helperText: '',
  });

  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isUsernameCorrect = usernameRegex.test(event.target.value);
    setUsername({
      value: event.currentTarget.value,
      error: !isUsernameCorrect,
      helperText: isUsernameCorrect ? '' : 'Sorry, username should be 8-12 characters long',
    });
  };

  const handleEmailTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    const isEmailCorrect = emailRegex.test(event.target.value);
    setStateFn({
      value: event.target.value,
      error: !isEmailCorrect,
      helperText: isEmailCorrect ? '' : 'Sorry, this email is invalid',
    });
  };

  const handlePasswordTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    const isPassswordCorrect = passwordRegex.test(event.target.value);
    setStateFn({
      value: event.target.value,
      error: !isPassswordCorrect,
      helperText: isPassswordCorrect ? '' : 'Sorry, this password is invalid',
    });
    // here should be comparing password and changing their states if necessary
  };

  const handleRegisterButton = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (
      !(
        username.error &&
        email.error &&
        emailRepeat.error &&
        password.error &&
        passwordRepeat.error
      )
    ) {
      register(
        username.value,
        email.value,
        emailRepeat.value,
        password.value,
        passwordRepeat.value
      ).then(
        response => {
          if (response.status === 200) {
            const message = response.data.message;
            if (message) {
              if (message === 'User with given username already exists')
                setUsername({
                  value: username.value,
                  error: true,
                  helperText: 'Sorry, this username is already used.',
                });
              else if (message === 'User with given email already exists') {
                setEmail({
                  value: email.value,
                  error: true,
                  helperText: 'Sorry, this email is already used.',
                });
              }
            } else {
              history.push('/welcome');
            }
          } else {
            window.alert('Unexpected behaviour');
            // should we even consider such option?
          }
        },
        error => {
          window.alert(`Unexpected error: ${error.response.status}`);
        }
      );
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
    >
      <FormHeader text="REGISTER" />
      <Stack
        direction="column"
        alignItems="stretch"
        spacing={1}
        component="form"
        sx={{ width: '100%' }}
        onSubmit={handleRegisterButton}
      >
        <LabeledTextInput
          text="Username"
          id="register-username"
          placeholder=""
          onChange={event => handleUsernameTextFieldChange(event)}
          helperText={username.helperText}
          error={username.error}
        />
        <LabeledTextInput
          text="Email"
          id="register-email-1"
          placeholder=""
          onChange={event => handleEmailTextFieldChange(event, setEmail)}
          helperText={email.helperText}
          error={email.error}
        />
        <LabeledTextInput
          text="Repeat email"
          id="register-email-2"
          placeholder=""
          onChange={event => handleEmailTextFieldChange(event, setEmailRepeat)}
          helperText={emailRepeat.helperText}
          error={emailRepeat.error}
        />
        <LabeledPasswordInput
          text="Password"
          id="register-password-1"
          placeholder=""
          onChange={event => handlePasswordTextFieldChange(event, setPassword)}
          helperText={password.helperText}
          error={password.error}
        />
        <LabeledPasswordInput
          text="Repeat password"
          id="register-password-2"
          placeholder=""
          onChange={event => handlePasswordTextFieldChange(event, setPasswordRepeat)}
          helperText={passwordRepeat.helperText}
          error={passwordRepeat.error}
        />
        <StandardButton text="Register" />
      </Stack>
      <ChangeFormComponent
        onSubmit={props.onChangeForm}
        firstLineText="Isn't your drunk face familiar?"
        secondLineText="Come here and..."
        buttonText="LOGIN"
      />
    </Stack>
  );
};
