import { Box, Stack, Typography } from '@mui/material';
import { Entry, MetadataInstance } from '../../../../codexSlice';
import { getEntryFromMetadata } from '../../../../utils';
import { ReferenceChip } from './components/ReferenceChip/ReferenceChip';

type EntryFieldProps = {
  fieldName: string;
  data: MetadataInstance[];
  entries: Entry[];
};

export const EntryField: React.FC<EntryFieldProps> = props => {
  const renderValue = () =>
    props.data.map(metadata =>
      metadata.type === 'string' ? (
        <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre' }}>{metadata.value}</Typography>
      ) : (
        <ReferenceChip entry={getEntryFromMetadata(metadata, props.entries)} />
      )
    );

  // eslint-disable-next-line no-console
  console.log(renderValue());
  // eslint-disable-next-line no-console
  console.log(props.entries);

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
      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>{renderValue()}</Box>
    </Stack>
  );
};
