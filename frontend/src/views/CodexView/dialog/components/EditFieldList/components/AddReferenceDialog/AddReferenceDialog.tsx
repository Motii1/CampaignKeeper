/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { CustomDialog } from '../../../../../../components/CustomDialog/CustomDialog';
import { Entry, Schema } from '../../../../../codexSlice';
import { CustomSelect } from './components/CustomSelect/CustomSelect';

export type SelectItem = {
  name: string;
  id: string;
};

type AddReferenceDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

const codexItemsToSelectItems = (items: Schema[] | Entry[]): SelectItem[] =>
  items.map(item => ({ name: item.title, id: item.id }));

export const AddReferenceDialog: React.FC<AddReferenceDialogProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const [chosenSchema, setChosenSchema] = useState<SelectItem | null>(null);
  const [_chosenEntry, setChosenEntry] = useState<SelectItem | null>(null);

  return (
    <CustomDialog title={'Add entry reference'} isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SCHEME
        </Typography>
        <CustomSelect
          id="schema-select"
          label="Choose schema"
          setValue={setChosenSchema}
          items={codexItemsToSelectItems(schemas)}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ENTRY
        </Typography>
        <CustomSelect
          id="entry-select"
          label="Choose entry"
          setValue={setChosenEntry}
          items={chosenSchema ? codexItemsToSelectItems(entries[chosenSchema.id]) : null}
        />
      </Stack>
    </CustomDialog>
  );
};
