import Cancel from '@mui/icons-material/Cancel';
import { Chip, Stack } from '@mui/material';
import { ReferenceFieldMetadata, ReferenceFieldsState } from '../../../../../../../types/types';

type FieldChipProps = {
  currentField: string;
  fieldContent: ReferenceFieldMetadata;
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

export const FieldChip: React.FC<FieldChipProps> = props => {
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
        deleteIcon={<Cancel sx={{ fill: '#262E38' }} />}
        onDelete={onDelete}
      />
    </Stack>
  );
};
