import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { resetState, updateName } from '../campaignViewSlice';
import { addSession, editSession } from '../sessionsSlice';

type NewSessionData = {
  name: string;
  campaignId: number;
};

type EditSessionData = {
  name: string;
};

type CampaignDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const CampaignDialog: React.FC<CampaignDialogProps> = props => {
  const dispatch = useDispatch();

  const { sessionId, sessionName, campaignId } = useSelector(
    (state: RootState) => state.campaignView
  );

  const [title, setTitle] = useState(
    props.dialogType === NavBarViewDialog.NewSession ? 'New session' : 'Edit session'
  );
  const [helperText, setHelperText] = useState<null | string>('');

  const resetDialog = useCallback(() => {
    setHelperText('');
    dispatch(resetState({}));
  }, [dispatch]);

  const {
    isLoading: isLoadingNew,
    data: dataNew,
    status: statusNew,
    runQuery: runQueryNew,
    resetQuery: resetQueryNew,
  } = useQuery<NewSessionData>(`/api/session`, requestMethods.POST);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addSession({ newSession: dataNew }));
        props.setSnackbarSuccess('Session created');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusNew === 400) {
        props.setSnackbarError('Error during session creation');
      } else if (statusNew === 404) {
        props.setSnackbarError('Campaign not found');
      }
      resetQueryNew();
    }
  }, [dataNew, dispatch, isLoadingNew, props, resetDialog, resetQueryNew, statusNew]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

  const {
    isLoading: isLoadingEdit,
    status: statusEdit,
    runQuery: runQueryEdit,
    resetQuery: resetQueryEdit,
  } = useQuery<EditSessionData>(`api/session/${sessionId}`, requestMethods.PATCH);

  const handleRunQueryEdit = useCallback(async () => {
    if (!isLoadingEdit && statusEdit) {
      if (statusEdit === 200) {
        dispatch(editSession({ id: sessionId, name: sessionName }));
        props.setSnackbarSuccess('Session edited');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusEdit === 400) {
        props.setSnackbarError('Error during session update');
      } else if (statusEdit === 404) {
        props.setSnackbarError('Session not found');
      }
      resetQueryEdit();
    }
  }, [
    isLoadingEdit,
    statusEdit,
    resetQueryEdit,
    dispatch,
    sessionId,
    sessionName,
    props,
    resetDialog,
  ]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  useEffect(() => {
    setTitle(props.dialogType === NavBarViewDialog.NewSession ? 'New session' : 'Edit session');
  }, [props.dialogType]);

  const validateName = (newName: string): string => {
    if (newName.length < 6) {
      return 'Name is too short';
    } else if (newName.length > 128) {
      return 'Name is too long';
    }

    return '';
  };

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateName({ name: event.target.value }));
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    dispatch(updateName({ name: event.target.value }));
    setHelperText(validateName(newName));
  };

  const handleOk = () => {
    if (validateName(sessionName) === '') {
      if (props.dialogType === NavBarViewDialog.NewSession) {
        runQueryNew({
          name: sessionName,
          campaignId: campaignId,
        });
      } else {
        runQueryEdit({
          name: sessionName,
        });
      }
    }
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  // important: secondaryDialog is responsible for handling deletion, here we only open it
  const handleDelete = () => {
    props.setIsSecondaryOpen(true);
  };

  const handleClose = () => {
    props.setIsOpen(false);
    if (props.dialogType === NavBarViewDialog.EditSession) resetDialog();
  };

  return (
    <Box>
      <CustomDialog
        title={title}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        onDelete={props.dialogType === NavBarViewDialog.EditSession ? handleDelete : undefined}
        onClose={handleClose}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <LabeledTextInput
            text={'Name'}
            placeholder={'Type here'}
            defaultValue={sessionName}
            helperText={helperText}
            defaultHelperText={''}
            onChange={event => handleTextInputChange(event)}
            onBlur={event => handleTextInputLeave(event)}
          />
        </Stack>
      </CustomDialog>
    </Box>
  );
};
