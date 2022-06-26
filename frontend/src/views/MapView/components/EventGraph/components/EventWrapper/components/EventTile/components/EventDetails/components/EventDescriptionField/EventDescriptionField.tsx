import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../../../../../store';
import { convertEntriesHashMapToList } from '../../../../../../../../../../../../utils/utils';
import { EventFieldMetadata } from '../../../../../../../../../../eventsSlice';
import { ReferenceChip } from './ReferenceChip/ReferenceChip';

type EventDescriptionFieldProps = {
  title: string;
  data: EventFieldMetadata[];
};

export const EventDescriptionField: React.FC<EventDescriptionFieldProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const renderValue = () => {
    const sortedData = [...props.data];
    sortedData.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    return sortedData.map(metadata => {
      if (metadata.type === 'string')
        return (
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
        );

      const entry = convertEntriesHashMapToList(entries).find(
        element => element.id.toString() === metadata.value
      );
      const schema = schemas.find(element => element.id === entry?.id);
      if (schema && entry)
        return <ReferenceChip entry={entry} schema={schema} key={metadata.sequenceNumber} />;
      return null;
    });
  };

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
      <Typography sx={{ color: 'customPalette.onBackgroundVariant', fontWeight: 'medium' }}>
        {props.title}
      </Typography>
      <Box sx={{ display: 'inline' }}>{renderValue()}</Box>
    </Stack>
  );
};
