import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addCampaign, resetState, updateState } from '../startViewSlice';

type StartDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
};

//TO-DO: think about adding wrapper (for all NavBarViews) on stack inside CustomDialog
//TO-DO: close Edit dialog after deleting campaign (export isOpen of primary dialog to Redux?)
export const StartDialog: React.FC<StartDialogProps> = props => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign'
  );
  const name = useSelector((state: RootState) => state.startView.name);
  const image = useSelector((state: RootState) => state.startView.image);
  const [helperText, setHelperText] = useState<null | string>('');

  useEffect(() => {
    setTitle(props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign');
  }, [props.dialogType]);

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
    //here will go handling new campaign creation with useQuery
    //and history.push('/campaign') redirecting user to new campaign
    dispatch(addCampaign({ campaignName: name }));
    props.setIsOpen(false);
    resetDialog();
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  const handleDelete = () => {
    //here will go handling campaign deletion with useQuery
    props.setIsSecondaryOpen(true);
  };

  const handleClose = () => {
    props.setIsOpen(false);
    if (props.dialogType === NavBarViewDialog.EditCampaign) resetDialog();
  };

  return (
    <CustomDialog
      title={title}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      //TO-DO: check if using undefined here is okay
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
          defaultValue={name}
          helperText={helperText}
          defaultHelperText={''}
          onChange={event => handleTextInputChange(event)}
          onBlur={event => handleTextInputLeave(event)}
        />
        <ImageUploadField
          height={180}
          width={390}
          image={image}
          setImage={newImage => dispatch(updateState({ image: newImage }))}
        />
      </Stack>
    </CustomDialog>
  );
};
