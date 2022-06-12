/* eslint-disable @typescript-eslint/no-empty-function */
import { Stack } from '@mui/material';
import { useState } from 'react';
import { NavBarViewDialog } from '../../../types/types';
import { createEmptyEventFields } from '../../../utils/utils';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { MapFieldList } from './components/MapFieldList/MapFieldList';

type CodexDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const MapDialog: React.FC<CodexDialogProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dialogTitle, _setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEvent ? 'Create new event' : `Edit event`
  );

  const referenceFieldNames = ['Place', 'Characters', 'Description'];
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventTitleHelperText, setEventTitleHelperText] = useState<string>('');
  const [referenceFields, setReferenceFields] = useState(
    createEmptyEventFields(referenceFieldNames)
  );

  const handleEventTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEventTitle(event.target.value);
    setEventTitleHelperText('');
  };
  const handleEventTitleLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = event.target.value;
    setEventTitle(newTitle);
    setEventTitleHelperText(() => {
      if (newTitle.length === 0) return "Event name can't be empty";
      if (newTitle.length > 128) return 'Event name is too long';
      return '';
    });
  };

  const handleOk = () => {};
  const handleCancel = () => {};
  const handleDelete = () => {};

  return (
    <CustomDialog
      title={dialogTitle}
      isOpen={props.isOpen}
      isLarge={false}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onDelete={handleDelete}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2.7}
        sx={{
          width: '100%',
          minWidth: '100%',
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
          sx={{
            minWidth: '100%',
          }}
        >
          <LabeledTextInput
            text={'Title'}
            value={eventTitle}
            placeholder={''}
            helperText={eventTitleHelperText}
            defaultHelperText={''}
            onChange={event => handleEventTitleChange(event)}
            onBlur={event => handleEventTitleLeave(event)}
          />
          <MapFieldList
            fieldNames={referenceFieldNames}
            fields={referenceFields}
            setFields={setReferenceFields}
          />
        </Stack>
      </Stack>
    </CustomDialog>
  );
};
