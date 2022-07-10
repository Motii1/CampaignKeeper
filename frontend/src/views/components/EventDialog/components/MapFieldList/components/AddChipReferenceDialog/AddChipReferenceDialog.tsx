/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { ReferenceFieldsState } from '../../../../../../../types/types';
import { Entry, Schema } from '../../../../../../CodexView/codexSlice';
import { AddReferenceSelect } from '../../../../../AddReferenceDialog/components/AddReferenceSelect/AddReferenceSelect';
import { CustomDialog } from '../../../../../CustomDialog/CustomDialog';

export type ReferenceSelectItem = {
  name: string;
  id: string;
};

type AddChipReferenceDialogProps = {
  currentField: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

const codexItemsToSelectItems = (items: Schema[] | Entry[]): ReferenceSelectItem[] =>
  items.map(item => ({ name: item.title, id: item.id }));

export const AddChipReferenceDialog: React.FC<AddChipReferenceDialogProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const [text, setText] = useState<string>('');
  const [chosenSchema, setChosenSchema] = useState<ReferenceSelectItem | null>(null);
  const [chosenEntry, setChosenEntry] = useState<ReferenceSelectItem | null>(null);

  const clearDialog = () => {
    setText('');
    setChosenSchema(null);
    setChosenEntry(null);
    props.setIsOpen(false);
  };

  const addNewField = (value: string, id: string | null = null) => {
    const newFields = props.fields;
    newFields[props.currentField] = newFields[props.currentField].concat({
      value: value,
      id: id,
    });
    props.setFields({ ...newFields });
    clearDialog();
  };

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleOk = () => {
    if (text !== '') {
      addNewField(text);
    } else if (chosenSchema && chosenEntry) {
      addNewField(`${chosenEntry.name}`, chosenEntry.id);
    }
  };

  const handleCancel = () => {
    clearDialog();
  };

  return (
    <CustomDialog
      title={props.currentField === 'Characters' ? 'Add character' : 'Add place'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
        <Typography
          sx={{
            color: 'customPalette.onSurface',
            fontWeight: 'normal',
            fontSize: 18,
            paddingLeft: 0.9,
          }}
        >
          Text
        </Typography>
        <TextField
          value={text}
          size="small"
          inputProps={{
            sx: {
              '&::placeholder': {
                color: 'customPalette.onBackground',
                opacity: 0.6,
              },
              '&::-ms-reveal': {
                filter: 'invert(100%)',
              },
              '&': {
                fontSize: 16,
                fontWeight: 'light',
              },
            },
          }}
          variant="outlined"
          fullWidth
          onChange={handleTextInput}
          sx={{
            backgroundColor: 'customPalette.background',
            borderRadius: 1,
            '& .MuiInputBase-root': {
              color: 'customPalette.onBackground',
              opacity: 1,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />
        <Typography
          sx={{
            color: 'customPalette.onSurface',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: 18,
            paddingLeft: 0.9,
          }}
        >
          Or
        </Typography>
        <AddReferenceSelect
          name="Scheme"
          id="schema-select"
          label="Choose schema"
          value={chosenSchema}
          setValue={setChosenSchema}
          items={codexItemsToSelectItems(schemas)}
        />
        {chosenSchema ? (
          <AddReferenceSelect
            name="Entry"
            id="entry-select"
            label="Choose entry"
            value={chosenEntry}
            setValue={setChosenEntry}
            items={chosenSchema ? codexItemsToSelectItems(entries[chosenSchema.id]) : null}
          />
        ) : null}
      </Stack>
    </CustomDialog>
  );
};
