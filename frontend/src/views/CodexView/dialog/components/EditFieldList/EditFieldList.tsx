import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { Schema } from '../../../codexSlice';
import { EntryFields } from '../../CodexDialog';
import { AddReferenceDialog } from './components/AddReferenceDialog/AddReferenceDialog';
import { FieldTextArea } from './components/FieldTextArea/FieldTextArea';

type EditFieldListProps = {
  currentSchema: Schema;
  fields: EntryFields;
  setFields: (newEntryFields: EntryFields) => void;
};

export const EditFieldList: React.FC<EditFieldListProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentField, setCurrentField] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleFieldInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = event.target.value;
    const newFields = props.fields;
    newFields[fieldName].value = newValue;
    props.setFields({ ...newFields });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '100%' }}
      >
        {props.currentSchema.fields.map(fieldName => (
          <FieldTextArea
            key={fieldName}
            name={fieldName}
            value={props.fields[fieldName].value}
            onChange={event => handleFieldInput(event, fieldName)}
            setCurrentField={setCurrentField}
            setIsAddDialogOpen={setIsAddDialogOpen}
          />
        ))}
      </Stack>
      <AddReferenceDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
    </Box>
  );
};
