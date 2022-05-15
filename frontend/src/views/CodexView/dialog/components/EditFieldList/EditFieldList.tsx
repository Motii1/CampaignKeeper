import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { Schema } from '../../../codexSlice';
import { convertEditFieldToString, getUpdatedEditField } from '../../../utils';
import { EditFieldsState } from '../../CodexDialog';
import { AddReferenceDialog } from './components/AddReferenceDialog/AddReferenceDialog';
import { FieldTextArea } from './components/FieldTextArea/FieldTextArea';

type EditFieldListProps = {
  currentSchema: Schema;
  fields: EditFieldsState;
  setFields: (newEntryFields: EditFieldsState) => void;
};

export const EditFieldList: React.FC<EditFieldListProps> = props => {
  const [currentField, setCurrentField] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleFieldInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = event.target.value;
    const newFields = props.fields;
    newFields[fieldName] = getUpdatedEditField(newFields[fieldName], newValue);
    props.setFields({ ...newFields });
  };

  const renderFields = () =>
    props.currentSchema.fields.map(fieldName => (
      <FieldTextArea
        key={fieldName}
        name={fieldName}
        value={convertEditFieldToString(props.fields[fieldName])}
        onChange={event => handleFieldInput(event, fieldName)}
        setCurrentField={setCurrentField}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
    ));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '100%' }}
      >
        {renderFields()}
      </Stack>
      <AddReferenceDialog
        currentField={currentField}
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        fields={props.fields}
        setFields={props.setFields}
      />
    </Box>
  );
};
