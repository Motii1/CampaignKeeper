import { Stack, Typography } from '@mui/material';
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
        <Typography
          sx={{
            wordWrap: 'break-word',
            display: 'inline',
            width: 'fit-content',
            color: 'customPalette.onSurface',
          }}
          key={metadata.sequenceNumber}
        >
          {metadata.value}
        </Typography>
      ) : (
        <ReferenceChip
          entry={getEntryFromMetadata(metadata, props.entries)}
          key={metadata.sequenceNumber}
        />
      )
    );

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
      <Typography variant={'h6'} sx={{ color: 'customPalette.onSurface' }}>
        {props.fieldName}
      </Typography>
      <Typography sx={{ display: 'inline' }}>{renderValue()}</Typography>
    </Stack>
  );
};
