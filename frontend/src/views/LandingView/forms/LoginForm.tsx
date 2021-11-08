import { Stack } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from '../../../services/auth/authServices';
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

export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const [username, setUsername] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [password, setPassword] = useState({
    value: '',
    error: false,
    helperText: '',
  });

  const [buttonState, setButtonState] = useState(true);

  const handleChange = (): void => {
    const anyFieldInvalid = username.error && password.error;
    setButtonState(!anyFieldInvalid);
  };

  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername({
      value: event.currentTarget.value,
      error: username.error,
      helperText: username.helperText,
    });
  };

  const handlePasswordTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword({
      value: event.currentTarget.value,
      error: password.error,
      helperText: password.helperText,
    });
  };

  const handleLoginButton = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (buttonState) {
      login(username.value, password.value).then(
        response => {
          if (response.status === 200) {
            history.push('/welcome');
          } else {
            window.alert('Unexpected behaviour');
          }
        },
        error => {
          if (error.response.status === 401) {
            setUsername({
              value: username.value,
              error: true,
              helperText: 'Sorry, username or email are incorrect',
            });
            setPassword({
              value: password.value,
              error: true,
              helperText: 'Sorry, username or email are incorrect',
            });
          } else window.alert('Unexpected error');
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
      <FormHeader text="LOGIN" />
      <Stack
        direction="column"
        alignItems="stretch"
        spacing={1}
        component="form"
        sx={{ width: '100%' }}
        onChange={handleChange}
        onSubmit={handleLoginButton}
      >
        <LabeledTextInput
          text="Username"
          id="login-username"
          placeholder=""
          onChange={event => handleUsernameTextFieldChange(event)}
          helperText={username.helperText}
          error={username.error}
        />
        <LabeledPasswordInput
          text="Password"
          id="login-password"
          placeholder=""
          onChange={event => handlePasswordTextFieldChange(event)}
          helperText={password.helperText}
          error={password.error}
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
