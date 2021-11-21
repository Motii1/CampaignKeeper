import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import {
  ChangeFormComponent,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

export type FormProps = {
  onChangeForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

export type TextFieldState = {
  value: string;
  helperText: null | string;
};

export const AUTH_URL = '/api/auth';

const register = (
  username: string,
  email: string,
  emailRepeat: string,
  password: string,
  passwordRepeat: string
): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/register`, {
    username: username,
    email: email,
    repeatedEmail: emailRepeat,
    password: password,
    repeatedPassword: passwordRepeat,
  });

export const RegisterForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const usernameRegex = /^(?=.{8,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,255}$/;

  const initalState = {
    value: '',
    helperText: '',
  };

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [email, setEmail] = useState<TextFieldState>(initalState);
  const [emailRepeat, setEmailRepeat] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);
  const [passwordRepeat, setPasswordRepeat] = useState<TextFieldState>(initalState);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    elementRegex: RegExp,
    setStateFn: (newState: TextFieldState) => void,
    helperText: string
  ): void => {
    const newValue = event.target.value;
    setStateFn({
      value: newValue,
      helperText: elementRegex.test(event.target.value) ? null : helperText,
    });
  };

  const handleTextFieldChangeTwin = (
    event: React.ChangeEvent<HTMLInputElement>,
    elementRegex: RegExp,
    setStateFn: (newState: TextFieldState) => void,
    invalidValueHelperText: string,
    twinTextFieldValue: string,
    mismatchValueHelperText: string
  ): void => {
    const newValue = event.target.value;
    let newHelperText = null;
    if (twinTextFieldValue && twinTextFieldValue !== newValue)
      newHelperText = mismatchValueHelperText;
    if (!elementRegex.test(event.target.value)) newHelperText = invalidValueHelperText;
    setStateFn({
      value: newValue,
      helperText: newHelperText,
    });
  };

  const handleRegisterButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (
      username.helperText === null &&
      email.helperText === null &&
      emailRepeat.helperText === null &&
      password.helperText === null &&
      passwordRepeat.helperText === null
    ) {
      const response = await register(
        username.value,
        email.value,
        emailRepeat.value,
        password.value,
        passwordRepeat.value
      );
      if (response.status === 200) {
        const message = response.data.message;
        if (message) {
          if (message === 'User with given username already exists')
            setUsername({
              value: username.value,
              helperText: 'Sorry, this username is already used.',
            });
          else if (message === 'User with given email already exists') {
            setEmail({
              value: email.value,
              helperText: 'Sorry, this email is already used.',
            });
            setEmailRepeat({
              value: email.value,
              helperText: 'Sorry, this email is already used.',
            });
          }
        } else {
          history.push('/welcome');
        }
      }
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
          helperText={username.helperText}
          onChange={event =>
            handleTextFieldChange(
              event,
              usernameRegex,
              setUsername,
              'Sorry, username should be 8-12 characters long'
            )
          }
        />
        <LabeledTextInput
          text="Email"
          id="register-email-1"
          placeholder=""
          helperText={email.helperText}
          onChange={event =>
            handleTextFieldChangeTwin(
              event,
              emailRegex,
              setEmail,
              'Sorry, this email is invalid',
              emailRepeat.value,
              "Emails don't match"
            )
          }
        />
        <LabeledTextInput
          text="Repeat email"
          id="register-email-2"
          placeholder=""
          helperText={emailRepeat.helperText}
          onChange={event =>
            handleTextFieldChangeTwin(
              event,
              emailRegex,
              setEmailRepeat,
              'Sorry, this email is invalid',
              email.value,
              "Emails don't match"
            )
          }
        />
        <LabeledPasswordInput
          text="Password"
          id="register-password-1"
          placeholder=""
          helperText={password.helperText}
          onChange={event =>
            handleTextFieldChangeTwin(
              event,
              passwordRegex,
              setPassword,
              'Sorry, this password is invalid',
              passwordRepeat.value,
              "Sorry, the passwords don't match"
            )
          }
        />
        <LabeledPasswordInput
          text="Repeat password"
          id="register-password-2"
          placeholder=""
          helperText={passwordRepeat.helperText}
          onChange={event =>
            handleTextFieldChangeTwin(
              event,
              passwordRegex,
              setPasswordRepeat,
              'Sorry, this password is invalid',
              password.value,
              "Sorry, the passwords don't match"
            )
          }
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
