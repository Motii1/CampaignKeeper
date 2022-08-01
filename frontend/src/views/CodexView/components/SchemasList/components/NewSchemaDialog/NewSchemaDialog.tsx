import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../axios/useQuery';
import { RootState } from '../../../../../../store';
import { CustomDialog } from '../../../../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../../../../components/LabeledTextInput/LabeledTextInput';
import { addSchema } from '../../../../codexSlice';
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
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Component seriving as dialog for creating new schema - allows setting new schema title
 * and its fields (by another dialog), opens on NewSchemaButton click
 * @param props
 * @returns
 */
export const NewSchemaDialog: React.FC<NewSchemaDialogProps> = props => {
  const dispatch = useDispatch();
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);

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
        props.setSnackbarSuccess('Schema created');
        props.setIsOpen(false);
        resetDialog();
      } else if (status === 400) {
        props.setSnackbarError('Error during schema creation');
      } else if (status === 404) {
        props.setSnackbarError("Campaign not found, can't create schema");
      }
      resetQuery();
    }
  }, [data, dispatch, isLoading, props, resetDialog, resetQuery, status]);

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
        campaignId: currentCampaignId,
        fields: fields,
      });
  };

  const handleCancel = () => {
    resetDialog();
    props.setIsOpen(false);
  };

  const renderFields = () =>
    fields.map(fieldName => (
      <Field name={fieldName} key={fieldName} fields={fields} setFields={setFields} />
    ));

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
        {renderFields()}
      </Stack>
    </CustomDialog>
  );
};
