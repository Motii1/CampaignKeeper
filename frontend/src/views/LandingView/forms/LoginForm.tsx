import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';
import { AUTH_URL, FormProps, TextFieldState } from './RegisterForm';

const login = (username: string, password: string): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/login`, {
    username: username,
    password: password,
  });

export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();

  const initalState = {
    value: '',
    helperText: '',
  };

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validationFn: (value: string) => boolean,
    setStateFn: (newState: TextFieldState) => void,
    helperText: string
  ): void => {
    const newValue = event.target.value;
    let newHelperText = null;
    if (!validationFn(newValue)) newHelperText = helperText;
    setStateFn({
      value: event.target.value,
      helperText: newHelperText,
    });
  };

  const validateUsername = (value: string) =>
    value.includes('@') || (value.length > 7 && value.length < 13);

  const validatePassword = (value: string) => value.length > 7 && value.length < 256;

  const handleLoginButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (validateUsername(username.value) && validatePassword(password.value)) {
      const response = await login(username.value, password.value);
      if (response.status === 200) {
        history.push('/welcome');
      } else if (response.status === 401) {
        setUsername({
          value: username.value,
          helperText: 'Invalid username/email or password',
        });
        setPassword({
          value: password.value,
          helperText: 'Invalid username/email or password',
        });
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
      <FormHeader text="LOGIN" />
      <Stack
        direction="column"
        spacing={1}
        component="form"
        sx={{ width: '100%' }}
        onSubmit={handleLoginButton}
      >
        <LabeledTextInput
          text="Email or username"
          id="login-username"
          placeholder="Thou name, brave hero"
          helperText={username.helperText}
          onChange={event =>
            handleTextFieldChange(
              event,
              validateUsername,
              setUsername,
              'Username is 8-12 characters long'
            )
          }
        />
        <LabeledPasswordInput
          text="Password"
          id="login-password"
          placeholder="Phrase that must not be spoken"
          helperText={password.helperText}
          onChange={event =>
            handleTextFieldChange(
              event,
              validatePassword,
              setPassword,
              'Password is 8-255 characters long'
            )
          }
        />
        <StandardButton text="Login" />
      </Stack>
      <ChangeFormComponent
        onSubmit={props.onChangeForm}
        firstLineText="Are you new here, adventurer?"
        secondLineText="Rest here and..."
        buttonText="Register"
      />
    </Stack>
  );
};
