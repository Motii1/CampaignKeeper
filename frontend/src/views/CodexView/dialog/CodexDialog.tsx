import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addEntry, EntriesHashMap, Entry, MetadataInstance, Schema } from '../codexSlice';
import { setCurrentEntry } from '../codexViewSlice';
import {
  convertEditFieldToMetadata,
  convertEntriesHashMapToList,
  getEditFieldFromMetadata,
} from '../utils';
import { EditFieldList } from './components/EditFieldList/EditFieldList';

export type EntryFieldState = {
  value: string;
  ids: string[];
};

export type EntryFields = {
  [fieldName: string]: EntryFieldState;
};

type NewEntryData = {
  title: string;
  schemaId: string;
  imageBase64: string;
  metadataArray: MetadataInstance[];
};

type EditEntryData = {
  title: string;
  imageBase64: string;
  metadataArray: MetadataInstance[];
};

type CodexDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

const createEmptyFields = (schema: null | Schema): EntryFields => {
  const currentFields: EntryFields = {};
  schema?.fields.forEach(field => (currentFields[field] = { value: '', ids: [] }));
  return currentFields;
};

const createFilledFields = (
  schema: null | Schema,
  entry: Entry | null,
  entries: EntriesHashMap
): EntryFields => {
  const currentFields: EntryFields = {};
  const entriesAsList: Entry[] = convertEntriesHashMapToList(entries);
  if (entry)
    schema?.fields.forEach(
      fieldName =>
        (currentFields[fieldName] = getEditFieldFromMetadata(
          fieldName,
          entry.metadataArray,
          entriesAsList
        ))
    );
  return currentFields;
};

export const CodexDialog: React.FC<CodexDialogProps> = props => {
  const dispatch = useDispatch();

  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);
  const { entries } = useSelector((state: RootState) => state.codex);
  const [dialogTitle, setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEntry
      ? 'Create new entry'
      : `Edit ${currentSchema?.title} entry`
  );
  const [entryTitle, setEntryTitle] = useState<string>('');
  const [entryTitleHelperText, setEntryTitleHelperText] = useState<string>('');
  const [fields, setFields] = useState(createEmptyFields(currentSchema));

  useEffect(() => {
    if (currentEntry) {
      setDialogTitle(`Edit ${currentSchema?.title} entry`);
      setFields(createFilledFields(currentSchema, currentEntry, entries));
      setEntryTitle(currentEntry.title);
    } else {
      setDialogTitle('Create new entry');
      setFields(createEmptyFields(currentSchema));
      setEntryTitle('');
    }
  }, [currentEntry, currentSchema, entries]);

  const resetDialog = useCallback(() => {
    if (currentEntry) {
      setDialogTitle(`Edit ${currentSchema?.title} entry`);
      setFields(createFilledFields(currentSchema, currentEntry, entries));
      setEntryTitle(currentEntry.title);
    } else {
      setDialogTitle('Create new entry');
      setFields(createEmptyFields(currentSchema));
      setEntryTitle('');
    }
  }, [currentEntry, currentSchema, entries]);

  const {
    isLoading: isLoadingNew,
    data: dataNew,
    status: statusNew,
    runQuery: runQueryNew,
    resetQuery: resetQueryNew,
  } = useQuery<NewEntryData>(`/api/object`, requestMethods.POST);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200 && currentSchema) {
        dispatch(addEntry({ newEntry: dataNew, schemaId: currentSchema.id }));
        dispatch(setCurrentEntry({ newEntry: dataNew }));
        props.setSnackbarSuccess('Entry created');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusNew === 400) {
        props.setSnackbarError('Error during entry creation');
      } else if (statusNew === 404) {
        props.setSnackbarError('Schema for this object not found');
      }
      resetQueryNew();
    }
  }, [
    currentSchema,
    dataNew,
    dispatch,
    isLoadingNew,
    props,
    resetDialog,
    resetQueryNew,
    statusNew,
  ]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

  const {
    isLoading: isLoadingEdit,
    status: statusEdit,
    runQuery: runQueryEdit,
    resetQuery: resetQueryEdit,
  } = useQuery<EditEntryData>(`api/object/${currentEntry?.id}`, requestMethods.PATCH);

  const handleRunQueryEdit = useCallback(async () => {
    if (!isLoadingEdit && statusEdit) {
      if (statusEdit === 200) {
        if (currentSchema && currentEntry) {
          dispatch(
            setCurrentEntry({
              newEntry: {
                id: currentEntry.id,
                schemaId: currentSchema.id,
                title: entryTitle,
                imageBase64: 'lorem ipsum',
                metadataArray: currentSchema?.fields
                  .map(fieldName => convertEditFieldToMetadata(fields[fieldName], fieldName))
                  .flat(),
              },
            })
          );
          props.setSnackbarSuccess('Entry edited');
          props.setIsOpen(false);
          resetDialog();
        }
      } else if (statusEdit === 400) {
        props.setSnackbarError('Error during entry update');
      } else if (statusEdit === 404) {
        props.setSnackbarError('Entry not found');
      } else if (statusNew === 413) {
        props.setSnackbarError('Entry graphic is too big');
      }
      resetQueryEdit();
    }
  }, [
    isLoadingEdit,
    statusEdit,
    statusNew,
    resetQueryEdit,
    currentSchema,
    currentEntry,
    dispatch,
    entryTitle,
    props,
    resetDialog,
    fields,
  ]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  const handleOk = () => {
    if (entryTitleHelperText === '' && currentSchema)
      if (props.dialogType === NavBarViewDialog.NewEntry)
        runQueryNew({
          title: entryTitle,
          schemaId: currentSchema.id.toString(),
          imageBase64: 'lorem ipsum',
          metadataArray: currentSchema.fields
            .map(fieldName => convertEditFieldToMetadata(fields[fieldName], fieldName))
            .flat(),
        });
      else
        runQueryEdit({
          title: entryTitle,
          imageBase64: 'lorem ipsum',
          metadataArray: currentSchema.fields
            .map(fieldName => convertEditFieldToMetadata(fields[fieldName], fieldName))
            .flat(),
        });
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  const handleDelete = () => {
    props.setIsSecondaryOpen(true);
  };

  const handleEntryTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEntryTitle(event.target.value);
    setEntryTitleHelperText('');
  };

  const handleEntryTitleLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = event.target.value;
    setEntryTitle(newTitle);
    setEntryTitleHelperText(() => {
      if (newTitle.length === 0) return "Entry name can't be empty";
      if (newTitle.length > 128) return 'Entry name is too long';
      return '';
    });
  };

  return (
    <CustomDialog
      title={dialogTitle}
      isOpen={props.isOpen}
      isLarge={true}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onDelete={handleDelete}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '100%' }}
      >
        {/* This one can't be LabeledTextInput due to the footer displaying validation of this component making a gap */}
        <LabeledTextInput
          text={'Title'}
          value={entryTitle}
          placeholder={''}
          helperText={entryTitleHelperText}
          defaultHelperText={''}
          onChange={event => handleEntryTitleChange(event)}
          onBlur={event => handleEntryTitleLeave(event)}
        />
        {currentSchema ? (
          <EditFieldList currentSchema={currentSchema} fields={fields} setFields={setFields} />
        ) : null}
      </Stack>
    </CustomDialog>
  );
};
