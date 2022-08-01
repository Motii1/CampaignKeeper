import { Box, Stack, Typography } from '@mui/material';
import { getEntryFromMetadata } from '../../../../../../utils/utils';
import { CodexMetadataInstance, Entry } from '../../../../codexSlice';
import { ReferenceChip } from './components/ReferenceChip/ReferenceChip';

type EntryFieldProps = {
  fieldName: string;
  data: CodexMetadataInstance[];
  entries: Entry[];
};

/**
 * Component responsible for displaying one entry field
 * @param props
 * @returns
 */
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
      <Typography variant="h5" sx={{ color: 'customPalette.onSurface', fontWeight: 'medium' }}>
        {props.fieldName}
      </Typography>
      <Box sx={{ display: 'inline' }}>{renderValue()}</Box>
    </Stack>
  );
};
