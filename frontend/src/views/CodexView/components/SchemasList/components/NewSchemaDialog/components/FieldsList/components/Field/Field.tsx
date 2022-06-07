import Cancel from '@mui/icons-material/Cancel';
import { Chip, Stack } from '@mui/material';

type FieldProps = {
  name: string;
  fields: string[];
  setFields: (newFields: string[]) => void;
};

export const Field: React.FC<FieldProps> = props => {
  const onDelete = () => {
    const newFields = props.fields;
    props.setFields(newFields.filter(name => name !== props.name));
  };

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5}>
      <Chip
        label={props.name.toUpperCase()}
        sx={{
          backgroundColor: 'customPalette.accent',
          color: 'customPalette.onAccent',
          fontWeight: 'bold',
        }}
        deleteIcon={<Cancel sx={{ fill: '#262E38' }} />}
        onDelete={onDelete}
      />
    </Stack>
  );
};
