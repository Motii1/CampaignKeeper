import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { StandardButton } from '../../components/StandardButton/StandardButton';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import { ChangeFormComponent } from './components/ChangeFormComponent/ChangeFormComponent';
import { LabeledTextInput } from './components/LabeledTextInput/LabeledTextInput';
import { AUTH_URL, FormProps, TextFieldState } from './RegisterForm';

export const login = (username: string, password: string): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/login`, {
    username: username,
    password: password,
  });

export type UserData = {
  username: string;
  email: string;
  image: string;
};

export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const initalState = {
    value: '',
    helperText: null,
  };

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);

  // handles login query
  const { isLoading, data, status, runQuery } = useQuery<UserData>(
    `${AUTH_URL}/login`,
    requestMethods.POST
  );

  const handleRunQuery = useCallback(() => {
    if (!isLoading && data && status) {
      if (status === 200) {
        dispatch(updateDetails({ username: data.username, email: data.email, avatar: data.image }));
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
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    setStateFn({
      value: event.target.value,
      helperText: null,
    });
  };

  const handleTextFieldLeave = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void,
    validateFn: (value: string) => string | null
  ): void => {
    const newValue = event.target.value;
    setStateFn({
      value: newValue,
      helperText: validateFn(newValue),
    });
  };

  const validateUsername = (value: string): null | string => {
    if (value.length === 0) {
      return "Login can't be empty";
    }
    if (value.length < 7 || value.length > 32) {
      return 'Login length must be between 7 and 32';
    }

    return null;
  };

  const validatePassword = (value: string): null | string => {
    if (value.length === 0) {
      return "Password can't be empty";
    }
    if (value.length < 7 || value.length > 255) {
      return 'Password length must be between 7 and 255';
    }

    return null;
  };

  const handleLoginButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const usernameValidation = validateUsername(username.value);
    const passwordValidation = validatePassword(password.value);

    if (usernameValidation === null && passwordValidation === null) {
      runQuery({
        username: username.value,
        password: password.value,
      });
    } else {
      setUsername({
        value: username.value,
        helperText: usernameValidation,
      });
      setPassword({
        value: password.value,
        helperText: passwordValidation,
      });
    }
  };

  return (
    <Stack
      direction="column"
      spacing={1}
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px' }}
    >
      <Stack
        direction="column"
        spacing={1}
        component="form"
        justifyContent="flex-start"
        alignItems="flex-start"
        onSubmit={handleLoginButton}
        sx={{ width: '100%' }}
      >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          sx={{ width: '100%' }}
        >
          <LabeledTextInput
            text="Email or username"
            id="login-username"
            placeholder="Thou name, brave hero"
            helperText={username.helperText}
            defaultHelperText=""
            onChange={event => handleTextFieldChange(event, setUsername)}
            onBlur={event => handleTextFieldLeave(event, setUsername, validateUsername)}
          />
          <LabeledTextInput
            text="Password"
            id="login-password"
            placeholder="Phrase that must not be spoken"
            helperText={password.helperText}
            defaultHelperText=""
            isPassword={true}
            onChange={event => handleTextFieldChange(event, setPassword)}
            onBlur={event => handleTextFieldLeave(event, setPassword, validatePassword)}
          />
        </Stack>
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
