import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { StartDialog } from '../../StartView/dialog/StartDialog';
import { resetState, updateState } from '../campaignViewSlice';

type CampaignDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
};

//TO-DO: close Edit dialog after deleting session (export isOpen of primary dialog to Redux?)
export const CampaignDialog: React.FC<CampaignDialogProps> = props => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    props.dialogType === NavBarViewDialog.NewSession ? 'New session' : 'Edit session'
  );
  const name = useSelector((state: RootState) => state.campaignView.name);
  const [helperText, setHelperText] = useState<null | string>('');

  useEffect(() => {
    switch (props.dialogType) {
      case NavBarViewDialog.EditSession:
        setTitle('Edit session');
        break;
      case NavBarViewDialog.EditCampaign:
        setTitle('Edit campaign');
        break;
      default:
        setTitle('New session');
    }
  }, [props.dialogType]);

  // user edits campaign name/image by clicking on its tile
  if (props.dialogType === NavBarViewDialog.EditCampaign)
    return (
      <StartDialog
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        dialogType={props.dialogType}
        setIsSecondaryOpen={props.setIsSecondaryOpen}
      />
    );

  const validateName = (newName: string) =>
    newName.length > 5 && newName.length < 43 ? '' : 'Too long/short name';

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateState({ name: event.target.value }));
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    dispatch(updateState({ name: event.target.value }));
    setHelperText(validateName(newName));
  };

  const resetDialog = () => {
    setHelperText('');
    dispatch(resetState({}));
  };

  const handleOk = () => {
    //here will go handling new session creation with useQuery
    props.setIsOpen(false);
    resetDialog();
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  const handleDelete = () => {
    //here will go handling session deletion with useQuery
    props.setIsSecondaryOpen(true);
  };

  const handleClose = () => {
    props.setIsOpen(false);
    if (props.dialogType === NavBarViewDialog.EditSession) resetDialog();
  };

  return (
    <CustomDialog
      title={title}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      //TO-DO: check if using undefined here is okay
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
          text={'NAME'}
          placeholder={'Type here'}
          defaultValue={name}
          helperText={helperText}
          defaultHelperText={''}
          onChange={event => handleTextInputChange(event)}
          onBlur={event => handleTextInputLeave(event)}
        />
      </Stack>
    </CustomDialog>
  );
};
