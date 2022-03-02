const usernameRegex = /^(?=.{7,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{7,255}$/;

export type TextFieldState = {
  value: string;
  helperText: null | string;
};

export const handleTextFieldChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setStateFn: (newState: TextFieldState) => void
): void => {
  setStateFn({
    value: event.target.value,
    helperText: null,
  });
};

export const handleTextFieldLeave = (
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

export const validateUsernameLogin = (value: string): null | string => {
  if (value.length === 0) {
    return "Login can't be empty";
  }
  if (value.length < 3 || value.length > 32) {
    return 'Login length must be between 3 and 32';
  }

  return null;
};

export const validateUsernameRegister = (value: string): null | string => {
  if (value.length < 7 || value.length > 32) return 'Must be between 7 and 32 characters';
  return !usernameRegex.test(value) ? 'Contains illegal characters' : null;
};

export const validatePasswordLogin = (value: string): null | string => {
  if (value.length === 0) {
    return "Password can't be empty";
  }
  if (value.length < 7 || value.length > 255) {
    return 'Password length must be between 7 and 255';
  }

  return null;
};

export const validatePasswordRegister = (value: string): null | string => {
  if (value.length < 7 || value.length > 255) return 'Must be between 7 and 255 characters';
  return !passwordRegex.test(value) ? 'It is too weak' : null;
};

export const validatePasswordsMatch = (value1: string, value2: string): null | string => {
  if (value1.length === 0 || value2.length === 0) return "Password can't be empty";
  return value1 !== value2 ? "Passwords don't match" : null;
};

export const validateEmail = (value: string): null | string => {
  if (value.length < 7 || value.length > 32) return 'Must be between 7 and 32 characters';
  return !emailRegex.test(value) ? 'This is not proper email' : null;
};

export const validateEmailsMatch = (value1: string, value2: string): null | string => {
  if (value1.length === 0 || value2.length === 0) return "Email can't be empty";
  return value1 !== value2 ? 'Emails dont match' : null;
};
