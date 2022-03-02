import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import requestMethods from '../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../axios/useQuery';
import {
  handleTextFieldChange,
  handleTextFieldLeave,
  handleTextFieldLeaveTwin,
  initalState,
  TextFieldState,
  validatePasswordLogin,
  validatePasswordRegister,
  validatePasswordsMatch,
} from '../../../../../../../../../../LandingView/forms/logic';
import { CustomButton } from '../../../../../../../../../CustomButton/CustomButton';
import { LabeledTextInput } from '../../../../../../../../../LabeledTextInput/LabeledTextInput';
import { ChangeFeedbackContentState } from '../../SettingsDialogContent';

type PasswordResponseData = {
  message?: string;
};

type ChangePasswordFormProps = {
  setChangeFeedbackContent: (newFeedbackContent: ChangeFeedbackContentState) => void;
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

    const currentPassRes = validatePasswordLogin(currentPassword.value);
    const newPassRes = validatePasswordRegister(newPassword.value);
    const newPassRepeatRes = validatePasswordsMatch(newPassword.value, newPasswordRepeat.value);
    // TO-DO: move to logic.ts in forms?
    if (currentPassRes) {
      setCurrentPassword({
        value: currentPassword.value,
        helperText: currentPassRes,
      });
    }

    if (newPassRes) {
      setNewPassword({
        value: newPassword.value,
        helperText: newPassRes,
      });
    }

    if (newPassRepeatRes) {
      setNewPasswordRepeat({
        value: newPasswordRepeat.value,
        helperText: newPassRepeatRes,
      });
    }

    if (currentPassRes === null && newPassRes === null && newPassRepeatRes === null) {
      runQueryPassword({
        currentPassword: currentPassword.value,
        password: newPassword.value,
        repeatedPassword: newPasswordRepeat.value,
      });
    }
  };

  const handleRunQueryPassword = useCallback(() => {
    if (!isLoadingPassword && statusPassword) {
      if (statusPassword === 200) {
        props.setChangeFeedbackContent({
          title: 'Sucess',
          text: 'Password successfully changed',
          isTitleRed: false,
        });
        props.runQueryDetails();
      } else if (statusPassword === 400 && dataPassword) {
        props.setChangeFeedbackContent({
          title: 'Error',
          text: dataPassword.message ? dataPassword.message : 'Failure during password change',
          isTitleRed: true,
        });
      } else if (statusPassword === 401) {
        props.setChangeFeedbackContent({
          title: 'Error',
          text: 'Wrong password',
          isTitleRed: true,
        });
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
        placeholder="Speak friend..."
        helperText={currentPassword.helperText}
        defaultHelperText="Prove that you are you"
        isPassword={true}
        onChange={event => handleTextFieldChange(event, setCurrentPassword)}
        onBlur={event => handleTextFieldLeave(event, setCurrentPassword, validatePasswordLogin)}
      />
      <LabeledTextInput
        text="New password"
        placeholder="..and enter."
        helperText={newPassword.helperText}
        defaultHelperText="Must contain one big letter and symbol"
        isPassword={true}
        onChange={event => handleTextFieldChange(event, setNewPassword)}
        onBlur={event => handleTextFieldLeave(event, setNewPassword, validatePasswordRegister)}
      />
      <LabeledTextInput
        text="Repeat password"
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
      <CustomButton text={'Change'} />
    </Stack>
  );
};
