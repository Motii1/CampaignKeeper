import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import { ChangeFormComponent } from './components/ChangeFormComponent/ChangeFormComponent';
import { LabeledTextInput } from './components/LabeledTextInput/LabeledTextInput';
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

  const usernameRegex = /^(?=.{7,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{7,255}$/;

  const initalState = {
    value: '',
    helperText: null,
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
    if (!isLoadingRegister && statusRegister === 200) {
      if (dataRegister?.message) {
        const message = dataRegister.message;
        if (message === 'User with given username already exists') {
          setUsername({
            value: username.value,
            helperText: 'Sorry, this username is already used',
          });
        } else if (message === 'User with given email already exists') {
          setEmail({
            value: email.value,
            helperText: 'Sorry, this email is already used',
          });
          setEmailRepeat({
            value: email.value,
            helperText: 'Sorry, this email is already used',
          });
        }
      } else {
        runQueryLogin({
          username: username.value,
          password: password.value,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRegister, isLoadingRegister, runQueryLogin, statusRegister]);

  useEffect(() => {
    handleUseQueryRegister();
  }, [handleUseQueryRegister]);

  const validateUsername = (value: string): null | string => {
    if (value.length < 7 || value.length > 32) return 'Must be between 7 and 32 characters';
    return !usernameRegex.test(value) ? 'Contains illegal characters' : null;
  };

  const validateEmail = (value: string): null | string => {
    if (value.length < 7 || value.length > 32) return 'Must be between 7 and 32 characters';
    return !emailRegex.test(value) ? 'This is not proper email' : null;
  };

  const validateEmailsMatch = (value1: string, value2: string): null | string => {
    if (value1.length === 0 || value2.length === 0) return "Email can't be empty";
    return value1 !== value2 ? 'Emails dont match' : null;
  };

  const validatePassword = (value: string): null | string => {
    if (value.length < 7 || value.length > 255) return 'Must be between 7 and 255 characters';
    return !passwordRegex.test(value) ? 'It is too weak' : null;
  };

  const validatePasswordsMatch = (value1: string, value2: string): null | string => {
    if (value1.length === 0 || value2.length === 0) return "Password can't be empty";
    return value1 !== value2 ? "Passwords don't match" : null;
  };

  const handleTextFieldLeave = (
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFn: (newState: TextFieldState) => void,
    validateFn: (value: string) => string | null,
    optionalFn?: () => void
  ): void => {
    const newValue = event.target.value;
    setStateFn({
      value: newValue,
      helperText: validateFn(newValue),
    });

    if (optionalFn) {
      optionalFn();
    }
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

    if (passRepeatRes) {
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
      await runQueryRegister({
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
            defaultHelperText="Must be between 7 and 32 characters"
            onChange={event => handleTextFieldChange(event, setUsername)}
            onBlur={event => handleTextFieldLeave(event, setUsername, validateUsername)}
          />
          <LabeledTextInput
            text="Email"
            id="register-email-1"
            placeholder="So your password won't be forgotten"
            helperText={email.helperText}
            defaultHelperText="Must be real email"
            onChange={event => handleTextFieldChange(event, setEmail)}
            onBlur={event => handleTextFieldLeave(event, setEmail, validateEmail)}
          />
          <LabeledTextInput
            text="Repeat email"
            id="register-email-2"
            placeholder="Make sure it's right"
            helperText={emailRepeat.helperText}
            defaultHelperText="Must be same as email above"
            onChange={event => handleTextFieldChange(event, setEmailRepeat)}
            onBlur={event =>
              handleTextFieldLeaveTwin(event, email.value, setEmailRepeat, validateEmailsMatch)
            }
          />
          <LabeledTextInput
            text="Password"
            id="register-password-1"
            placeholder="Mellon"
            helperText={password.helperText}
            defaultHelperText="Must contain one big letter and symbol"
            isPassword={true}
            onChange={event => handleTextFieldChange(event, setPassword)}
            onBlur={event => handleTextFieldLeave(event, setPassword, validatePassword)}
          />
          <LabeledTextInput
            text="Repeat password"
            id="register-password-2"
            placeholder="Repeat every letter"
            helperText={passwordRepeat.helperText}
            defaultHelperText="Must be same as password above"
            isPassword={true}
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
        <CustomButton text="Register" />
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
