import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addCampaign, editCampaign } from '../campaignsSlice';
import { resetState, updateImage, updateName } from '../startViewSlice';

type SingleCampaignData = {
  id: number;
  name: string;
  createdAt: Date;
  imageBase64: string;
};

type StartDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const StartDialog: React.FC<StartDialogProps> = props => {
  const dispatch = useDispatch();

  const { campaignId, campaignName, campaignImageBase64 } = useSelector(
    (state: RootState) => state.startView
  );

  const [title, setTitle] = useState(
    props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign'
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
  } = useQuery<SingleCampaignData>(`/api/campaign`, requestMethods.POST);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addCampaign({ newCampaign: dataNew }));
        props.setSnackbarSuccess('Campaign created');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusNew === 400) {
        props.setSnackbarError('Error during campaign creation');
      } else if (statusNew === 413) {
        props.setSnackbarError('Campaign graphic is too big');
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
  } = useQuery<SingleCampaignData>(`api/campaign/${campaignId}`, requestMethods.PATCH);

  const handleRunQueryEdit = useCallback(async () => {
    if (!isLoadingEdit && statusEdit) {
      if (statusEdit === 200) {
        if (campaignImageBase64) {
          dispatch(
            editCampaign({ id: campaignId, name: campaignName, imageBase64: campaignImageBase64 })
          );
        } else {
          dispatch(editCampaign({ id: campaignId, name: campaignName }));
        }
        props.setSnackbarSuccess('Campaign edited');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusEdit === 400) {
        props.setSnackbarError('Error during campaign update');
      } else if (statusEdit === 404) {
        props.setSnackbarError("Campaign can't be found");
      } else if (statusNew === 413) {
        props.setSnackbarError('Campaign graphic is too big');
      }
      resetQueryEdit();
    }
  }, [
    isLoadingEdit,
    statusEdit,
    statusNew,
    resetQueryEdit,
    campaignImageBase64,
    props,
    resetDialog,
    dispatch,
    campaignId,
    campaignName,
  ]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  useEffect(() => {
    setTitle(props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign');
  }, [props.dialogType]);

  const validateName = (newName: string): string => {
    if (newName.length < 6) {
      return 'Name is too short';
    } else if (newName.length > 42) {
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
    if (validateName(campaignName) === '') {
      if (props.dialogType === NavBarViewDialog.NewCampaign) {
        runQueryWithImg(runQueryNew);
      } else {
        runQueryWithImg(runQueryEdit);
      }
    }
  };

  const runQueryWithImg = (runQueryFn: (data?: unknown) => void): void => {
    if (campaignImageBase64) {
      runQueryFn({
        name: campaignName,
        imageBase64: campaignImageBase64,
      });
    } else {
      runQueryFn({ name: campaignName });
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
    if (props.dialogType === NavBarViewDialog.EditCampaign) resetDialog();
  };

  return (
    <Box>
      <CustomDialog
        title={title}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        onDelete={props.dialogType === NavBarViewDialog.EditCampaign ? handleDelete : undefined}
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
            text={'NAME'}
            placeholder={'Type here'}
            defaultValue={campaignName}
            helperText={helperText}
            defaultHelperText={''}
            onChange={event => handleTextInputChange(event)}
            onBlur={event => handleTextInputLeave(event)}
          />
          <ImageUploadField
            height={180}
            width={390}
            image={campaignImageBase64}
            setImage={newImageBase64 => {
              dispatch(updateImage({ imageBase64: newImageBase64 }));
            }}
          />
        </Stack>
      </CustomDialog>
    </Box>
  );
};
