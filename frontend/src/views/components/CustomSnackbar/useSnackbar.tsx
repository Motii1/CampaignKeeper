import { useState } from 'react';
import { CustomSnackbarType } from '../../../types/types';
import { CustomSnackbarProps } from './CustomSnackbar';

type useSnackbarArgs = {
  snackbarProperties: CustomSnackbarProps;
  setSnackbarInfo: (message: string) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Custom React hook used to simplify control of CustomSnackbar
 * in its parent component and allow children components
 * to control it as well (by passing control functions as props)
 * @returns
 */
export const useSnackbar = (): useSnackbarArgs => {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<CustomSnackbarType>(CustomSnackbarType.Info);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const snackbarProperties = {
    message: snackbarMessage,
    type: snackbarType,
    isOpen: isSnackbarOpen,
    setIsOpen: setIsSnackbarOpen,
  };

  const setSnackbarInfo = (message: string): void => {
    setSnackbarType(CustomSnackbarType.Info);
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
  };

  const setSnackbarSuccess = (message: string): void => {
    setSnackbarType(CustomSnackbarType.Success);
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
  };

  const setSnackbarError = (message: string): void => {
    setSnackbarType(CustomSnackbarType.Error);
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
  };

  return { snackbarProperties, setSnackbarInfo, setSnackbarSuccess, setSnackbarError };
};
