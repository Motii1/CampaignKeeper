import Cancel from '@mui/icons-material/Cancel';
import { Chip, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { ReferenceFieldMetadata, ReferenceFieldsState } from '../../../../../../../types/types';

type FieldChipProps = {
  currentField: string;
  fieldContent: ReferenceFieldMetadata;
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

/**
 * Chips used to represent reference to Codex entry or object outside of it in EventDialog
 * @param props
 * @returns
 */
export const FieldChip: React.FC<FieldChipProps> = props => {
  const { isLight } = useSelector((state: RootState) => state.theme);

  const onDelete = () => {
    const newFields = props.fields;
    if (props.fieldContent.id)
      newFields[props.currentField] = newFields[props.currentField].filter(
        field => field.id !== props.fieldContent.id
      );
    else
      newFields[props.currentField] = newFields[props.currentField].filter(
        field => field.value !== props.fieldContent.value
      );
    props.setFields({ ...newFields });
  };

  const getIconColor = () => {
    if (props.fieldContent.id) {
      return '#000000';
    }

    return isLight ? '#ffffff' : '#000000';
  };

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5}>
      <Chip
        label={props.fieldContent.value}
        sx={{
          backgroundColor: props.fieldContent.id
            ? 'customPalette.accent'
            : 'customPalette.onBackground',
          color: props.fieldContent.id ? 'customPalette.onAccent' : 'customPalette.background',
          fontWeight: 'bold',
        }}
        deleteIcon={<Cancel sx={{ fill: getIconColor() }} />}
        onDelete={onDelete}
      />
    </Stack>
  );
};
