/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { CustomDialog } from '../../../../../../components/CustomDialog/CustomDialog';
import { Entry, Schema } from '../../../../../codexSlice';
import { EntryFieldsState } from '../../../../CodexDialog';
import { CustomSelect } from './components/CustomSelect/CustomSelect';

export type SelectItem = {
  name: string;
  id: string;
};

type AddReferenceDialogProps = {
  currentField: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  fields: EntryFieldsState;
  setFields: (newEntryFields: EntryFieldsState) => void;
};

const codexItemsToSelectItems = (items: Schema[] | Entry[]): SelectItem[] =>
  items.map(item => ({ name: item.title, id: item.id }));

export const AddReferenceDialog: React.FC<AddReferenceDialogProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const [chosenSchema, setChosenSchema] = useState<SelectItem | null>(null);
  const [chosenEntry, setChosenEntry] = useState<SelectItem | null>(null);

  const handleOk = () => {
    if (chosenSchema && chosenEntry) {
      const newFields = props.fields;
      newFields[props.currentField] = newFields[props.currentField].concat({
        value: `${chosenEntry.name}`,
        id: chosenEntry.id,
      });
      props.setFields({ ...newFields });
      props.setIsOpen(false);
    }
  };

  const handleCancel = () => {
    props.setIsOpen(false);
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
        <CustomSelect
          name="SCHEME"
          id="schema-select"
          label="Choose schema"
          setValue={setChosenSchema}
          items={codexItemsToSelectItems(schemas)}
        />
        {chosenSchema ? (
          <CustomSelect
            name="ENTRY"
            id="entry-select"
            label="Choose entry"
            setValue={setChosenEntry}
            items={chosenSchema ? codexItemsToSelectItems(entries[chosenSchema.id]) : null}
          />
        ) : null}
      </Stack>
    </CustomDialog>
  );
};
