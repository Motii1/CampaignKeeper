import { Stack } from '@mui/material';
import { useState } from 'react';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

type FormProps = {
  onChangeForm: () => void;
};

type TextFieldState = {
  value: string;
  error: boolean;
  helperText: string;
};

export const RegisterForm: React.FC<FormProps> = props => {
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

  const [buttonState, setButtonState] = useState(true);

  const handleChange = (): void => {
    const anyFieldInvalid =
      username.error && email.error && emailRepeat.error && password.error && passwordRepeat.error;
    setButtonState(!anyFieldInvalid);
  };

  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername({
      value: event.currentTarget.value,
      error: !usernameRegex.test(event.currentTarget.value),
      helperText: usernameRegex.test(event.currentTarget.value)
        ? ''
        : 'Username should be 8-12 characters long',
    });
  };

  const handleEmailTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    setStateFn({
      value: event.currentTarget.value,
      error: !emailRegex.test(event.currentTarget.value),
      helperText: emailRegex.test(event.currentTarget.value) ? '' : 'Invalid email',
    });
    // here should be comparing emails and changing their states if necessary
  };

  const handlePasswordTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    setStateFn({
      value: event.currentTarget.value,
      error: !passwordRegex.test(event.currentTarget.value),
      helperText: passwordRegex.test(event.currentTarget.value)
        ? ''
        : 'Invalid password, it should be 8-255 characters long',
    });
    // here should be comparing password and changing their states if necessary
  };

  const handleRegisterButton = (): void => {
    if (buttonState) {
      window.alert('Register');
      // here should be sending request to register and handling response
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
        onChange={handleChange}
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
