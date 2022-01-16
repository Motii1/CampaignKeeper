import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import {
  ChangeFormComponent,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';
import { UserData } from './LoginForm';

type RegisterData = {
  message: string;
};

export type FormProps = {
  onChangeForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

export type TextFieldState = {
  value: string;
  helperText: null | string;
};

export const AUTH_URL = '/api/auth';

export const RegisterForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const usernameRegex = /^(?=.{7,42}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{7,255}$/;

  const initalState = {
    value: '',
    helperText: '',
  };

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [email, setEmail] = useState<TextFieldState>(initalState);
  const [emailRepeat, setEmailRepeat] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);
  const [passwordRepeat, setPasswordRepeat] = useState<TextFieldState>(initalState);

  // handles login query after successful registration query
  const {
    isLoading: isLoadingLogin,
    data: dataLogin,
    status: statusLogin,
    runQuery: runQueryLogin,
  } = useQuery<UserData>(`${AUTH_URL}/login`, requestMethods.POST);

  const handleRunQueryLogin = useCallback(() => {
    if (!isLoadingLogin && dataLogin && statusLogin) {
      if (statusLogin === 200) {
        dispatch(updateDetails({ username: dataLogin.username, email: dataLogin.email }));
        history.push(viewsRoutes.START);
      } else history.push(viewsRoutes.ERROR);
    }
  }, [dataLogin, dispatch, history, isLoadingLogin, statusLogin]);

  useEffect(() => {
    handleRunQueryLogin();
  }, [handleRunQueryLogin]);

  // handles registration query
  const {
    isLoading: isLoadingRegister,
    data: dataRegister,
    status: statusRegister,
    runQuery: runQueryRegister,
  } = useQuery<RegisterData>(`${AUTH_URL}/register`, requestMethods.POST);

  const handleUseQueryRegister = useCallback(() => {
    if (!isLoadingRegister && dataRegister?.message && statusRegister === 200) {
      const message = dataRegister.message;
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
      } else {
        runQueryLogin({
          username: username.value,
          password: password.value,
        });
      }
    }
  }, [
    dataRegister,
    email.value,
    isLoadingRegister,
    password.value,
    runQueryLogin,
    statusRegister,
    username.value,
  ]);

  useEffect(() => {
    handleUseQueryRegister();
  }, [handleUseQueryRegister]);

  const validateUsername = (value: string): null | string => {
    if (value.length === 0) {
      return "Login can't be empty";
    }
    if (value.length < 7 || value.length > 32) {
      return 'Username length must be between 7 and 32';
    }
    if (!usernameRegex.test(value)) {
      return 'Username contains illegal characters';
    }

    return null;
  };

  const validateEmail = (value: string): null | string => {
    if (value.length === 0) {
      return "Email can't be empty";
    }
    if (value.length <= 7 || value.length >= 42) {
      return 'Email length must be between 7 and 42';
    }
    if (!emailRegex.test(value)) {
      return 'Email contains illegal characters';
    }

    return null;
  };

  const validateEmailsMatch = (value1: string, value2: string): null | string => {
    if (validateEmail(value1) === null && value1 !== value2) {
      return 'Emails dont match';
    }

    return null;
  };

  const validatePassword = (value: string): null | string => {
    if (value.length === 0) {
      return "Password can't be empty";
    }
    if (value.length <= 7 || value.length >= 255) {
      return 'Password length must be between 7 and 255';
    }
    if (!passwordRegex.test(value)) {
      return 'Password is too weak';
    }

    return null;
  };

  const validatePasswordsMatch = (value1: string, value2: string): null | string => {
    if (validatePassword(value1) === null && value1 !== value2) {
      return "Passwords don't match";
    }

    return null;
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

  const handleTextFieldLeaveTwin = (
    event: React.ChangeEvent<HTMLInputElement>,
    twin: string,
    setStateFn: (newState: TextFieldState) => void,
    validateFn: (value1: string, value2: string) => string | null
  ): void => {
    const newValue = event.target.value;
    setStateFn({
      value: newValue,
      helperText: validateFn(twin, newValue),
    });
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void
  ): void => {
    setStateFn({
      value: event.target.value,
      helperText: null,
    });
  };

  const handleRegisterButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const userRes = validateUsername(username.value);
    const emailRes = validateEmail(email.value);
    const emailRepeatRes = validateEmailsMatch(email.value, emailRepeat.value);
    const passRes = validatePassword(password.value);
    const passRepeatRes = validatePasswordsMatch(password.value, passwordRepeat.value);

    if (userRes) {
      setUsername({
        value: username.value,
        helperText: userRes,
      });
    }

    if (emailRes) {
      setEmail({
        value: email.value,
        helperText: emailRes,
      });
    }

    if (emailRepeatRes) {
      setEmailRepeat({
        value: emailRepeat.value,
        helperText: emailRepeatRes,
      });
    }

    if (passRes) {
      setPassword({
        value: password.value,
        helperText: passRes,
      });
    }

    if (passRepeatRes !== null) {
      setPasswordRepeat({
        value: passwordRepeat.value,
        helperText: passRepeatRes,
      });
    }

    if (
      userRes === null &&
      emailRes === null &&
      emailRepeatRes === null &&
      passRes === null &&
      passRepeatRes === null
    ) {
      runQueryRegister({
        username: username.value,
        email: email.value,
        repeatedEmail: emailRepeat.value,
        password: password.value,
        repeatedPassword: passwordRepeat.value,
      });
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px' }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        component="form"
        sx={{ width: '100%' }}
        onSubmit={handleRegisterButton}
      >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          sx={{ width: '100%' }}
        >
          <LabeledTextInput
            text="Username"
            id="register-username"
            placeholder="Pick unique one"
            helperText={username.helperText}
            onChange={event => handleTextFieldChange(event, setUsername)}
            onBlur={event => handleTextFieldLeave(event, setUsername, validateUsername)}
          />
          <LabeledTextInput
            text="Email"
            id="register-email-1"
            placeholder="So your password won't be forgotten"
            helperText={email.helperText}
            onChange={event => handleTextFieldChange(event, setEmail)}
            onBlur={event => handleTextFieldLeave(event, setEmail, validateEmail)}
          />
          <LabeledTextInput
            text="Repeat email"
            id="register-email-2"
            placeholder="Make sure it's right"
            helperText={emailRepeat.helperText}
            onChange={event => handleTextFieldChange(event, setEmailRepeat)}
            onBlur={event =>
              handleTextFieldLeaveTwin(event, email.value, setEmailRepeat, validateEmailsMatch)
            }
          />
          <LabeledPasswordInput
            text="Password"
            id="register-password-1"
            placeholder="Melon"
            helperText={password.helperText}
            onChange={event => handleTextFieldChange(event, setPassword)}
            onBlur={event => handleTextFieldLeave(event, setPassword, validatePassword)}
          />
          <LabeledPasswordInput
            text="Repeat password"
            id="register-password-2"
            placeholder="Repeat every letter"
            helperText={passwordRepeat.helperText}
            onChange={event => handleTextFieldChange(event, setPasswordRepeat)}
            onBlur={event =>
              handleTextFieldLeaveTwin(
                event,
                password.value,
                setPasswordRepeat,
                validatePasswordsMatch
              )
            }
          />
        </Stack>
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
