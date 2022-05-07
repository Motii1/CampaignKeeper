import { Stack, Typography } from '@mui/material';
import { MetadataInstance } from '../../../../codexSlice';

type EntryFieldProps = {
  fieldName: string;
  data: MetadataInstance[];
};

export const EntryField: React.FC<EntryFieldProps> = props => {
  const value = props.data.map(element => element.value).join(' ');

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{
        width: '100%',
      }}
    >
      <Typography variant={'h6'}>{props.fieldName}</Typography>
      <Typography sx={{ width: '100%', wordWrap: 'break-word' }}>{value}</Typography>
    </Stack>
  );
};
