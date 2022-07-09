/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { ReferenceFieldsState } from '../../../../../types/types';
import {
  convertReferenceFieldToString,
  getUpdatedReferenceField,
} from '../../../../../utils/utils';
import { AddReferenceDialog } from '../../../../components/AddReferenceDialog/AddReferenceDialog';
import { FieldTextArea } from '../../../../components/FieldTextArea/FieldTextArea';
import { AddChipReferenceDialog } from './components/AddChipReferenceDialog/AddChipReferenceDialog';
import { FieldChipArea } from './components/FieldChipArea/FieldChipArea';

type MapFieldListProps = {
  fieldNames: string[];
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

export const MapFieldList: React.FC<MapFieldListProps> = props => {
  const [currentChipField, setCurrentChipField] = useState('');
  const [isChipDialogOpen, setIsChipDialogOpen] = useState(false);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);

  const handleFieldInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = event.target.value;
    const newFields = props.fields;
    newFields[fieldName] = getUpdatedReferenceField(newFields[fieldName], newValue);
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
        <FieldChipArea
          key={'Place'}
          name={'Place'}
          value={convertReferenceFieldToString(props.fields['Place'])}
          onChange={event => handleFieldInput(event, 'Place')}
          setCurrentField={setCurrentChipField}
          setIsAddDialogOpen={setIsChipDialogOpen}
        />
        <FieldChipArea
          key={'Characters'}
          name={'Characters'}
          value={convertReferenceFieldToString(props.fields['Characters'])}
          onChange={event => handleFieldInput(event, 'Characters')}
          setCurrentField={setCurrentChipField}
          setIsAddDialogOpen={setIsChipDialogOpen}
        />
        <FieldTextArea
          key={'Description'}
          name={'Description'}
          value={convertReferenceFieldToString(props.fields['Description'])}
          onChange={event => handleFieldInput(event, 'Description')}
          setCurrentField={setCurrentChipField}
          setIsAddDialogOpen={setIsDescriptionDialogOpen}
        />
      </Stack>
      <AddChipReferenceDialog
        currentField={currentChipField}
        isOpen={isChipDialogOpen}
        setIsOpen={setIsChipDialogOpen}
        fields={props.fields}
        setFields={props.setFields}
      />
      <AddReferenceDialog
        currentField={'Description'}
        isOpen={isDescriptionDialogOpen}
        setIsOpen={setIsDescriptionDialogOpen}
        fields={props.fields}
        setFields={props.setFields}
      />
    </Box>
  );
};
