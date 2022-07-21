/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ReferenceFieldsState } from '../../../types/types';
import { Entry, Schema } from '../../CodexView/codexSlice';
import { CustomDialog } from '../CustomDialog/CustomDialog';
import { AddReferenceSelect } from './components/AddReferenceSelect/AddReferenceSelect';

export type ReferenceSelectItem = {
  name: string;
  id: string;
};

type AddReferenceDialogProps = {
  currentField: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

const codexItemsToSelectItems = (items: Schema[] | Entry[]): ReferenceSelectItem[] =>
  items.map(item => ({ name: item.title, id: item.id }));

export const AddReferenceDialog: React.FC<AddReferenceDialogProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const [chosenSchema, setChosenSchema] = useState<ReferenceSelectItem | null>(null);
  const [chosenEntry, setChosenEntry] = useState<ReferenceSelectItem | null>(null);

  const clearDialog = () => {
    setChosenSchema(null);
    setChosenEntry(null);
    props.setIsOpen(false);
  };

  const handleOk = () => {
    if (chosenSchema && chosenEntry) {
      const newFields = props.fields;
      newFields[props.currentField] = newFields[props.currentField].concat({
        value: `${chosenEntry.name}`,
        id: chosenEntry.id,
      });
      props.setFields({ ...newFields });
      props.setIsOpen(false);
      clearDialog();
    }
  };

  const handleCancel = () => {
    clearDialog();
  };

  return (
    <CustomDialog
      title={'Add entry reference'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
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
