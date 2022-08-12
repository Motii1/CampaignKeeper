import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import {
  convertReferenceFieldToCodexMetadata,
  createEmptyCodexFields,
  createFilledCodexFields,
} from '../../../utils/utils';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addEntry, CodexMetadataInstance, editEntry } from '../codexSlice';
import { setCurrentEntry } from '../codexViewSlice';
import { CodexFieldList } from './components/EditFieldList/CodexFieldList';

type NewEntryData = {
  title: string;
  schemaId: string;
  imageBase64: string;
  metadataArray: CodexMetadataInstance[];
};

type EditEntryData = {
  title: string;
  imageBase64: string;
  metadataArray: CodexMetadataInstance[];
};

type CodexDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Component serving as main dialog in CodexView, used for creation of new entries
 * and editing/deleting existing ones. Can be opened in "create new entry" mode
 * (all fields are empty) by FAB when schema is selected and no entry is selected
 * or in "edit entry" mode by FAB when entry is selected
 * @param props
 * @returns
 */
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
  const [fields, setFields] = useState(createEmptyCodexFields(currentSchema));
  const [entryImageBase64, setEntryImageBase64] = useState<string | null>(null);

  useEffect(() => {
    if (currentEntry) {
      setDialogTitle(`Edit ${currentSchema?.title} entry`);
      setFields(createFilledCodexFields(currentSchema, currentEntry, entries));
      setEntryTitle(currentEntry.title);
    } else {
      setDialogTitle('Create new entry');
      setFields(createEmptyCodexFields(currentSchema));
      setEntryTitle('');
    }
  }, [currentEntry, currentSchema, entries]);

  const resetDialog = useCallback(() => {
    if (currentEntry) {
      setDialogTitle(`Edit ${currentSchema?.title} entry`);
      setFields(createFilledCodexFields(currentSchema, currentEntry, entries));
      setEntryTitle(currentEntry.title);
      setEntryImageBase64(currentEntry.imageBase64);
    } else {
      setDialogTitle('Create new entry');
      setFields(createEmptyCodexFields(currentSchema));
      setEntryTitle('');
      setEntryImageBase64(null);
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
        resetDialog();
        props.setIsOpen(false);
        props.setSnackbarSuccess('Entry created');
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
          const editedEntry = {
            id: currentEntry.id,
            schemaId: currentSchema.id,
            title: entryTitle,
            imageBase64: entryImageBase64,
            metadataArray: currentSchema?.fields
              .map(fieldName => convertReferenceFieldToCodexMetadata(fields[fieldName], fieldName))
              .flat(),
          };
          dispatch(setCurrentEntry({ newEntry: editedEntry }));
          dispatch(editEntry({ schemaId: currentSchema.id, newEntry: editedEntry }));
          resetDialog();
          props.setIsOpen(false);
          props.setSnackbarSuccess('Entry edited');
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
    entryImageBase64,
    props,
    resetDialog,
    fields,
  ]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  const handleOk = () => {
    if (entryTitleHelperText === '' && currentSchema)
      if (props.dialogType === NavBarViewDialog.NewEntry) {
        runQueryNew({
          title: entryTitle,
          schemaId: currentSchema.id.toString(),
          imageBase64: entryImageBase64,
          metadataArray: currentSchema.fields
            .map(fieldName => convertReferenceFieldToCodexMetadata(fields[fieldName], fieldName))
            .flat(),
        });
      } else {
        runQueryEdit({
          title: entryTitle,
          imageBase64: entryImageBase64,
          metadataArray: currentSchema.fields
            .map(fieldName => convertReferenceFieldToCodexMetadata(fields[fieldName], fieldName))
            .flat(),
        });
      }
  };

  const handleCancel = () => {
    resetDialog();
    props.setIsOpen(false);
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

  if (currentSchema)
    return (
      <CustomDialog
        title={dialogTitle}
        isOpen={props.isOpen}
        isLarge={true}
        setIsOpen={props.setIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        onDelete={props.dialogType === NavBarViewDialog.EditEntry ? handleDelete : undefined}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2.7}
          sx={{
            width: '100%',
            minWidth: '100%',
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{
              minWidth: 'calc(100% - 230px)',
            }}
          >
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
              <CodexFieldList currentSchema={currentSchema} fields={fields} setFields={setFields} />
            ) : null}
          </Stack>
          <ImageUploadField
            height={320}
            width={200}
            image={entryImageBase64}
            setImage={newImageBase64 => {
              setEntryImageBase64(newImageBase64);
            }}
          />
        </Stack>
      </CustomDialog>
    );

  return null;
};
