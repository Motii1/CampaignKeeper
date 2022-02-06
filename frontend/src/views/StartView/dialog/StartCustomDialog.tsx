import { Stack } from '@mui/material';
import { useState } from 'react';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';

type StartCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

//TO-DO: think about adding wrapper (for all NavBarViews) on stack inside CustomDialog
//TO-DO: make sure that campaign name is not lost after closing dialog
export const StartCustomDialog: React.FC<StartCustomDialogProps> = props => {
  const [name, setName] = useState('');
  const [helperText, setHelperText] = useState<null | string>('');
  const [image, setImage] = useState<null | File>(null);
  const validateName = (newName: string) =>
    newName.length > 5 && newName.length < 43 ? '' : 'Too long/short name';

  // eslint-disable-next-line no-console
  console.log(name, image); //will be removed after API finished, added to avoid errors from eslint

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    setName(event.target.value);
    setHelperText(validateName(newName));
  };

  const resetFields = () => {
    setName('');
    setHelperText('');
    setImage(null);
  };

  const handleOk = () => {
    //here will go handling new campaign creation with useQuery
    //and history.push('/campaign') redirecting user to new campaign
    resetFields();
    props.setIsOpen(false);
  };

  const handleCancel = () => {
    setImage(null);
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'New Campaign'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
        <LabeledTextInput
          text={'NAME'}
          placeholder={'Type here'}
          defaultValue={name}
          helperText={helperText}
          defaultHelperText={''}
          onChange={event => handleTextInputChange(event)}
          onBlur={event => handleTextInputLeave(event)}
        />
        <ImageUploadField image={image} setImage={setImage} />
      </Stack>
    </CustomDialog>
  );
};
