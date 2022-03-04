import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import requestMethods from '../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../axios/useQuery';
import { CustomSnackbarType } from '../../../../../../../../../../../types/types';
import {
  handleTextFieldChange,
  handleTextFieldLeave,
  handleTextFieldLeaveTwin,
  initalState,
  TextFieldState,
  validateField,
  validateMatch,
  validatePasswordLogin,
  validatePasswordRegister,
  validatePasswordsMatch,
} from '../../../../../../../../../../LandingView/forms/logic';
import { CustomButton } from '../../../../../../../../../CustomButton/CustomButton';
import { LabeledTextInput } from '../../../../../../../../../LabeledTextInput/LabeledTextInput';

type PasswordResponseData = {
  message?: string;
};

type ChangePasswordFormProps = {
  setChangeFeedbackMessage: (newFeedbackMessage: string) => void;
  setChangeFeedbackType: (newFeedbackType: CustomSnackbarType) => void;
  setIsChangeFeedbackOpen: (newIsOpen: boolean) => void;
  runQueryDetails: (payload?: unknown) => void;
};

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = props => {
  const [currentPassword, setCurrentPassword] = useState<TextFieldState>(initalState);
  const [newPassword, setNewPassword] = useState<TextFieldState>(initalState);
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<TextFieldState>(initalState);

  // handles change user details query
  const {
    isLoading: isLoadingPassword,
    data: dataPassword,
    status: statusPassword,
    runQuery: runQueryPassword,
    resetQuery: resetQueryPassword,
  } = useQuery<PasswordResponseData>(`/api/user/details`, requestMethods.PUT, {
    'Content-Type': 'application/json',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isCurrentPasswordValid = validateField(
      currentPassword.value,
      validatePasswordLogin,
      setCurrentPassword
    );
    const isNewPasswordValid = validateField(
      newPassword.value,
      validatePasswordRegister,
      setNewPassword
    );
    const isNewPasswordRepeatValid = validateMatch(
      newPassword.value,
      newPasswordRepeat.value,
      validatePasswordsMatch,
      setNewPasswordRepeat
    );

    if (isCurrentPasswordValid && isNewPasswordValid && isNewPasswordRepeatValid) {
      runQueryPassword({
        currentPassword: currentPassword.value,
        password: newPassword.value,
        repeatedPassword: newPasswordRepeat.value,
      });
    }
  };

  // TO-DO: clear values and reset helper texts after success in changing password
  const handleRunQueryPassword = useCallback(() => {
    if (!isLoadingPassword && statusPassword) {
      if (statusPassword === 200) {
        props.runQueryDetails();
        props.setChangeFeedbackMessage('Password successfully changed');
        props.setChangeFeedbackType(CustomSnackbarType.Success);
        setCurrentPassword({
          value: '',
          helperText: '',
        });
        setNewPassword({
          value: '',
          helperText: '',
        });
        setNewPasswordRepeat({
          value: '',
          helperText: '',
        });
      } else if (statusPassword === 401 && dataPassword) {
        props.setChangeFeedbackMessage(
          dataPassword.message ? dataPassword.message : 'Failure during password change'
        );
        props.setChangeFeedbackType(CustomSnackbarType.Error);
      } else {
        props.setChangeFeedbackMessage('Failure during password change');
        props.setChangeFeedbackType(CustomSnackbarType.Error);
      }
      props.setIsChangeFeedbackOpen(true);
      resetQueryPassword();
    }
  }, [dataPassword, isLoadingPassword, props, resetQueryPassword, statusPassword]);

  useEffect(() => {
    handleRunQueryPassword();
  }, [handleRunQueryPassword]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      spacing={0.5}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h6">PASSWORD</Typography>
      <LabeledTextInput
        text="Current password"
        value={currentPassword.value}
        placeholder="Speak friend..."
        helperText={currentPassword.helperText}
        defaultHelperText="Prove that you are you"
        isPassword={true}
        onChange={event => handleTextFieldChange(event, setCurrentPassword)}
        onBlur={event => handleTextFieldLeave(event, setCurrentPassword, validatePasswordLogin)}
      />
      <LabeledTextInput
        text="New password"
        value={newPassword.value}
        placeholder="..and enter."
        helperText={newPassword.helperText}
        defaultHelperText="Must contain one big letter and symbol"
        isPassword={true}
        onChange={event => handleTextFieldChange(event, setNewPassword)}
        onBlur={event => handleTextFieldLeave(event, setNewPassword, validatePasswordRegister)}
      />
      <LabeledTextInput
        text="Repeat password"
        value={newPasswordRepeat.value}
        placeholder="Mellon!"
        helperText={newPasswordRepeat.helperText}
        defaultHelperText="Must be same as password above"
        isPassword={true}
        onChange={event => handleTextFieldChange(event, setNewPasswordRepeat)}
        onBlur={event =>
          handleTextFieldLeaveTwin(
            event,
            newPasswordRepeat.value,
            setNewPasswordRepeat,
            validatePasswordsMatch
          )
        }
      />
      <Box sx={{ paddingTop: 1 }}>
        <CustomButton text={'Change'} />
      </Box>
    </Stack>
  );
};
