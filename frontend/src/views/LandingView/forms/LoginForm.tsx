import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import { useQuery } from '../../../axios/useQuery';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import {
  ChangeFormComponent,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';
import { AUTH_URL, FormProps, TextFieldState } from './RegisterForm';

export const login = (username: string, password: string): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/login`, {
    username: username,
    password: password,
  });

export type UserData = {
  username: string;
  email: string;
};

export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const initalState = {
    value: '',
    helperText: '',
  };

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);

  // handles login query
  const { isLoading, data, status, runQuery } = useQuery<UserData>(`${AUTH_URL}/login`);

  const handleRunQuery = useCallback(() => {
    if (!isLoading && data && status) {
      if (status === 200) {
        dispatch(updateDetails({ username: data.username, email: data.email }));
        history.push(viewsRoutes.START);
      } else if (status === 401) {
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
  }, [data, dispatch, history, isLoading, password.value, status, username.value]);

  useEffect(() => {
    handleRunQuery();
  }, [handleRunQuery]);

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
      runQuery({
        username: username.value,
        password: password.value,
      });
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '20px' }}
    >
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
