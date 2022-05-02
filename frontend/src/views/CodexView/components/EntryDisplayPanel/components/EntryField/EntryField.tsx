import { Stack, Typography } from '@mui/material';
import { metadataInstance } from '../../../../codexViewSlice';

type EntryFieldProps = {
  name: string;
  data: metadataInstance[];
};

export const EntryField: React.FC<EntryFieldProps> = props => {
  const value = props.data.map(element => element.value).join(' ');

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Typography variant={'h6'}>{props.name}</Typography>
      <Typography variant={'subtitle1'}>{value}</Typography>
    </Stack>
  );
};
