/* eslint-disable no-console */
import { Stack } from '@mui/material';
import { useState } from 'react';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';

type StartCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

//TO-DO: think about adding wrapper (for all NavBarViews) on stack inside CustomDialog
export const StartCustomDialog: React.FC<StartCustomDialogProps> = props => {
  const [name, setName] = useState('');
  const [helperText, setHelperText] = useState<null | string>('');
  const validateName = (newName: string) =>
    newName.length > 5 && newName.length < 43 ? '' : 'Too long/short name';

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    setName(event.target.value);
    setHelperText(validateName(newName));
    console.log(name);
  };

  return (
    <CustomDialog title={'New Campaign'} isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
        <LabeledTextInput
          text={'NAME'}
          placeholder={'Type here'}
          helperText={helperText}
          defaultHelperText={''}
          onChange={event => handleTextInputChange(event)}
          onBlur={event => handleTextInputLeave(event)}
        />
      </Stack>
    </CustomDialog>
  );
};
