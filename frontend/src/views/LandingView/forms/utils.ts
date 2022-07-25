import { Dispatch, SetStateAction } from 'react';

const usernameRegex = /^(?=.{7,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,255}$/;

/**
 * Type for TextFields with validation in LandingView
 * and helper text displayed when validation fails
 */
export type TextFieldState = {
  value: string;
  helperText: null | string;
};

/**
 * Default state TextFields with validation in LandingView
 */
export const initalState = {
  value: '',
  helperText: null,
};

/**
 * Function for handling change event in TextFields with validation in LandingView
 * @param event
 * @param setStateFn
 */
export const handleTextFieldChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setStateFn: (newState: TextFieldState) => void
): void => {
  setStateFn({
    value: event.target.value,
    helperText: null,
  });
};

/**
 * Function for handling blur event in TextFields with validation in LandingView
 * @param event
 * @param setStateFn
 */
export const handleTextFieldLeave = (
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

/**
 * Function for handling blur event in TextFields in LandingView which have another TextField
 * paired with them (e.g. "password" field and "repeat password" field). Validates content of both
 * TextFields and sets field state appropriately
 * @param event
 * @param twin
 * @param setStateFn
 * @param validateFn
 */
export const handleTextFieldLeaveTwin = (
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

/**
 * Function used to validate username in LoginForm (where it can actually be username or e-mail)
 * @param value
 * @returns
 */
export const validateUsernameLogin = (value: string): null | string => {
  if (value.length === 0) {
    return "Login can't be empty";
  }
  if (value.length < 3 || value.length > 32) {
    return 'Login length must be between 3 and 32';
  }

  return null;
};

/**
 * Function used to validate username in RegisterForm (where it can be only username)
 * @param value
 * @returns
 */
export const validateUsernameRegister = (value: string): null | string => {
  if (value.length < 8 || value.length > 32) return 'Must be between 8 and 32 characters';
  return !usernameRegex.test(value) ? 'Contains illegal characters' : null;
};

/**
 * Function used to validate password in LoginForm (where only length is checked)
 * @param value
 * @returns
 */
export const validatePasswordLogin = (value: string): null | string => {
  if (value.length === 0) {
    return "Password can't be empty";
  }
  if (value.length < 8 || value.length > 255) {
    return 'Password length must be between 8 and 255';
  }

  return null;
};

/**
 * Function used to validate password in RegisterForm (where length and strength are checked)
 * @param value
 * @returns
 */
export const validatePasswordRegister = (value: string): null | string => {
  if (value.length < 8 || value.length > 255) return 'Must be between 8 and 255 characters';
  return !passwordRegex.test(value) ? 'It is too weak' : null;
};

/**
 * Function used to check if both passwords match each other in RegisterForm
 * @param value1
 * @param value2
 * @returns
 */
export const validatePasswordsMatch = (value1: string, value2: string): null | string => {
  if (value1.length === 0 || value2.length === 0) return "Password can't be empty";
  return value1 !== value2 ? "Passwords don't match" : null;
};

/**
 * Function used to validate emial in RegisterForm (checked by regex)
 * @param value
 * @returns
 */
export const validateEmail = (value: string): null | string => {
  if (value.length < 3 || value.length > 32) return 'Must be between 7 and 32 characters';
  return !emailRegex.test(value) ? 'This is not proper email' : null;
};

/**
 * Function used to check if both emails match each other in RegisterForm
 * @param value1
 * @param value2
 * @returns
 */
export const validateEmailsMatch = (value1: string, value2: string): null | string => {
  if (value1.length === 0 || value2.length === 0) return "Email can't be empty";
  return value1 !== value2 ? "Emails don't match" : null;
};

/**
 * Generic function for validating fields (causing display of helper text
 * with info about wrong content if necessary by change of field's state) in LandingView
 * @param fieldValue
 * @param validateFn
 * @param setStateFn
 * @returns
 */
export const validateField = (
  fieldValue: string,
  validateFn: (fieldValue: string) => null | string,
  setStateFn: Dispatch<SetStateAction<TextFieldState>>
): boolean => {
  const newHelperText = validateFn(fieldValue);
  if (newHelperText) {
    setStateFn({
      value: fieldValue,
      helperText: newHelperText,
    });
    return false;
  }

  return true;
};

/**
 * Generic function for checking if two paired fields match each other (causing display
 * of helper text with info about wrong content if necessary by change of field's state)
 * in RegisterForm
 * @param fieldValue
 * @param validateFn
 * @param setStateFn
 * @returns
 */
export const validateMatch = (
  fieldValue: string,
  fieldRepeatValue: string,
  validateFn: (fieldValue1: string, fieldValue2: string) => null | string,
  setStateFn: Dispatch<SetStateAction<TextFieldState>>
): boolean => {
  const newHelperText = validateFn(fieldValue, fieldRepeatValue);
  if (newHelperText) {
    setStateFn({
      value: fieldRepeatValue,
      helperText: newHelperText,
    });
    return false;
  }

  return true;
};
