import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../../axios/requestMethods';
import { useQuery } from '../../../../axios/useQuery';
import { RootState } from '../../../../store';
import { CustomDialog } from '../../../components/CustomDialog/CustomDialog';
import { useSnackbar } from '../../../components/CustomSnackbar/useSnackbar';
import { LabeledTextInput } from '../../../components/LabeledTextInput/LabeledTextInput';
import { addSchema } from '../../codexSlice';
import { Field } from './components/FieldsList/components/Field/Field';
import { FieldsBar } from './components/FieldsList/components/FieldsBar/FieldsBar';

type SchemaData = {
  title: string;
  campaignId: string;
  fields: string[];
};

type NewSchemaDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const NewSchemaDialog: React.FC<NewSchemaDialogProps> = props => {
  const dispatch = useDispatch();
  const { currentCampaignId: campaignId } = useSelector((state: RootState) => state.campaignView);
  const { setSnackbarSuccess, setSnackbarError } = useSnackbar();

  const [name, setName] = useState('');
  const [helperText, setHelperText] = useState<null | string>(null);
  const [fields, setFields] = useState<string[]>([]);

  const resetDialog = useCallback(() => {
    setName('');
    setHelperText(null);
    setFields([]);
  }, []);

  const { isLoading, data, status, runQuery, resetQuery } = useQuery<SchemaData>(
    `/api/schema`,
    requestMethods.POST
  );

  const handleRunQuery = useCallback(() => {
    if (!isLoading && status) {
      if (status === 200) {
        dispatch(addSchema({ newSchema: data }));
        setSnackbarSuccess('Schema created');
        props.setIsOpen(false);
        resetDialog();
      } else if (status === 400) {
        setSnackbarError('Error during schema creation');
      } else if (status === 404) {
        setSnackbarError("Campaign not found, can't create schema");
      }
      resetQuery();
    }
  }, [
    data,
    dispatch,
    isLoading,
    props,
    resetDialog,
    resetQuery,
    setSnackbarError,
    setSnackbarSuccess,
    status,
  ]);

  useEffect(() => {
    handleRunQuery();
  }, [handleRunQuery]);

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    setName(newName);
    setHelperText(() => {
      if (newName.length === 0) return "Schema name can't be empty";
      if (newName.length > 128) return 'Schema name is too long';
      return null;
    });
  };

  const handleOk = () => {
    if (!helperText)
      runQuery({
        title: name,
        campaignId: campaignId,
        fields: fields,
      });
  };

  const handleCancel = () => {
    resetDialog();
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'Create schema'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <LabeledTextInput
        text={'Title'}
        placeholder={'Enter new schema name'}
        helperText={helperText}
        defaultHelperText={''}
        onChange={event => handleTextInputChange(event)}
        onBlur={event => handleTextInputLeave(event)}
      />
      <FieldsBar fields={fields} setFields={setFields} />
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
        {fields.map(fieldName => (
          <Field name={fieldName} key={fieldName} fields={fields} setFields={setFields} />
        ))}
      </Stack>
    </CustomDialog>
  );
};
