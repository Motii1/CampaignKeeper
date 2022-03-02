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

export const validateLogin = (value: string): null | string => {
  if (value.length === 0) {
    return "Login can't be empty";
  }
  if (value.length < 3 || value.length > 32) {
    return 'Login length must be between 3 and 32';
  }

  return null;
};

export const validatePassword = (value: string): null | string => {
  if (value.length === 0) {
    return "Password can't be empty";
  }
  if (value.length < 7 || value.length > 255) {
    return 'Password length must be between 7 and 255';
  }

  return null;
};
