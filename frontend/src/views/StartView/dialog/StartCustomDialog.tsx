import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { updateState } from '../startViewSlice';

type StartCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

//TO-DO: think about adding wrapper (for all NavBarViews) on stack inside CustomDialog
//TO-DO: make sure that campaign name is not lost after closing dialog
export const StartCustomDialog: React.FC<StartCustomDialogProps> = props => {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.startView.name);
  const image = useSelector((state: RootState) => state.startView.image);
  const [helperText, setHelperText] = useState<null | string>('');

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

  const resetFields = () => {
    dispatch(updateState({ name: '', image: null }));
    setHelperText('');
  };

  const handleOk = () => {
    //here will go handling new campaign creation with useQuery
    //and history.push('/campaign') redirecting user to new campaign
    resetFields();
    props.setIsOpen(false);
  };

  const handleCancel = () => {
    resetFields();
    props.setIsOpen(false);
  };

  const handleDelete = () => {
    //here will go handling campaign deletion with useQuery
    //and history.push('/campaign') redirecting user to new campaign
    resetFields();
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'New / Edit Campaign'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onDelete={handleDelete}
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
