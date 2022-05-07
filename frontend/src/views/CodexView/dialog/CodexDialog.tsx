import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addEntry, Entry, MetadataInstance, Schema } from '../codexSlice';
import { setCurrentEntry } from '../codexViewSlice';
import { convertFieldToMetadataArray, getValueFromMetadataByFieldName } from '../components/utils';
import { FieldTextArea } from './components/FieldTextArea/FieldTextArea';

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

type EntryFields = { [fieldName: string]: string };

const createEmptyFields = (schema: null | Schema): EntryFields => {
  const currentFields: EntryFields = {};
  schema?.fields.forEach(field => (currentFields[field] = ''));
  return currentFields;
};

const createFilledFields = (schema: null | Schema, entry: Entry | null): EntryFields => {
  const currentFields: EntryFields = {};
  schema?.fields.forEach(
    fieldName =>
      (currentFields[fieldName] = getValueFromMetadataByFieldName(fieldName, entry?.metadataArray))
  );
  return currentFields;
};

export const CodexDialog: React.FC<CodexDialogProps> = props => {
  const dispatch = useDispatch();

  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);
  const [dialogTitle, setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEntry
      ? 'Create new entry'
      : `Edit ${currentSchema?.title} entry`
  );
  const [entryTitle, setEntryTitle] = useState<string>('');
  const [entryTitleHelperText, setEntryTitleHelperText] = useState<string>('');
  const [fields, setFields] = useState(createEmptyFields(currentSchema));

  useEffect(() => {
    if (currentEntry) setDialogTitle(`Edit ${currentSchema?.title} entry`);
    else setDialogTitle('Create new entry');
  }, [currentEntry, currentSchema?.title]);

  useEffect(() => {
    if (currentEntry) {
      setFields(createFilledFields(currentSchema, currentEntry));
      setEntryTitle(currentEntry.title);
    }
  }, [currentEntry, currentSchema]);

  const resetDialog = useCallback(() => {
    setEntryTitle('');
    setEntryTitleHelperText('');
    setFields(createEmptyFields(currentSchema));
  }, [currentSchema]);

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
                title: entryTitle,
                imageBase64: 'lorem ipsum',
                metadataArray: currentSchema?.fields.map(fieldName =>
                  convertFieldToMetadataArray(fields[fieldName], fieldName)
                ),
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
          metadataArray: currentSchema.fields.map(fieldName =>
            convertFieldToMetadataArray(fields[fieldName], fieldName)
          ),
        });
      else
        runQueryEdit({
          title: entryTitle,
          imageBase64: 'lorem ipsum',
          metadataArray: currentSchema.fields.map(fieldName =>
            convertFieldToMetadataArray(fields[fieldName], fieldName)
          ),
        });
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

  const handleFieldInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = event.target.value;
    const newFields = fields;
    newFields[fieldName] = newValue;
    setFields({ ...newFields });
  };

  const renderFields = () => {
    if (currentSchema)
      return currentSchema.fields.map(fieldName => (
        <FieldTextArea
          key={fieldName}
          name={fieldName}
          value={fields[fieldName]}
          onChange={event => handleFieldInput(event, fieldName)}
        />
      ));
    return null;
  };

  return (
    <CustomDialog
      title={dialogTitle}
      isOpen={props.isOpen}
      isLarge={true}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
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
        {renderFields()}
      </Stack>
    </CustomDialog>
  );
};
