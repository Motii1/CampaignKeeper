/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addEntry, Schema } from '../codexViewSlice';
import { FieldTextArea } from './components/FieldTextArea/FieldTextArea';
import { convertStringToMetadataArray } from './utils';

type EntryFields = { [fieldName: string]: string };

type NewEntryData = {
  title: string;
  schemaId: string;
  imageBase64: string;
  metadataArray: [
    {
      type: string;
      value: string;
      sequenceNumber: number;
      fieldName: string;
    }
  ];
};

type CodexDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

const createInitialState = (schema: null | Schema): EntryFields => {
  const initialState: EntryFields = {};
  schema?.fields.forEach(field => (initialState[field] = ''));
  return initialState;
};

export const CodexDialog: React.FC<CodexDialogProps> = props => {
  const dispatch = useDispatch();

  const { currentSchema } = useSelector((state: RootState) => state.codexView);

  const [dialogTitle, _setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEntry
      ? 'Create new entry'
      : `Edit ${currentSchema?.title} entry`
  );
  const [entryTitle, setEntryTitle] = useState<string>('');
  const [entryTitleHelperText, setEntryTitleHelperText] = useState<string>('');
  const [fields, setFields] = useState(createInitialState(currentSchema));

  const {
    isLoading: isLoadingNew,
    data: dataNew,
    status: statusNew,
    runQuery: runQueryNew,
    resetQuery: resetQueryNew,
  } = useQuery<NewEntryData>(`/api/object`, requestMethods.POST);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addEntry({ newEntry: dataNew }));
        props.setSnackbarSuccess('Entry created');
        props.setIsOpen(false);
        // resetDialog();
      } else if (statusNew === 400) {
        props.setSnackbarError('Error during entry creation');
      } else if (statusNew === 404) {
        props.setSnackbarError('Schema for this object not found');
      }
      resetQueryNew();
    }
  }, [dataNew, dispatch, isLoadingNew, props, resetQueryNew, statusNew]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

  const handleOk = () => {
    if (entryTitleHelperText === '' && currentSchema)
      runQueryNew({
        title: entryTitle,
        schemaId: currentSchema.id.toString(),
        imageBase64: 'lorem ipsum',
        metadataArray: currentSchema.fields.map(fieldName =>
          convertStringToMetadataArray(fields[fieldName], fieldName)
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
        <LabeledTextInput
          text={'TITLE'}
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
