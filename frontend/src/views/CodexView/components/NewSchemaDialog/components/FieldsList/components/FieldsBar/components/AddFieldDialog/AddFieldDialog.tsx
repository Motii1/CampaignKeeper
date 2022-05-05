import { useState } from 'react';
import { CustomDialog } from '../../../../../../../../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../../../../../../../../components/LabeledTextInput/LabeledTextInput';

type AddFieldDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  fields: string[];
  setFields: (newFields: string[]) => void;
};

export const AddFieldDialog: React.FC<AddFieldDialogProps> = props => {
  const [name, setName] = useState('');
  const [helperText, setHelperText] = useState<null | string>(null);

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    setName(newName);
    setHelperText(() => {
      if (newName.length === 0) return "Field name can't be empty";
      if (newName.length > 128) return 'Field name is too long';
      if (props.fields.includes(newName)) return 'Field name ialready exists';
      return null;
    });
  };

  const onOk = () => {
    if (helperText === null) {
      const currentFields = props.fields;
      currentFields.push(name);
      props.setFields([...currentFields]);
      props.setIsOpen(false);
    }
  };

  const onCancel = () => {
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'Add field'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={onOk}
      onCancel={onCancel}
    >
      <LabeledTextInput
        text={'Name'}
        placeholder={'Enter new field name'}
        helperText={helperText}
        defaultHelperText={''}
        onChange={event => handleTextInputChange(event)}
        onBlur={event => handleTextInputLeave(event)}
      />
    </CustomDialog>
  );
};
