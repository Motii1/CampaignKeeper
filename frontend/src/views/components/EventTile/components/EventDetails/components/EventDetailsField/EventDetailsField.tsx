/* eslint-disable no-console */
import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { convertEntriesHashMapToList } from '../../../../../../../utils/utils';
import { EventFieldMetadata } from '../../../../../../MapView/eventsSlice';
import { EntryReferenceChip } from './components/EntryReferenceChip/EntryReferenceChip';
import { EntryTextChip } from './components/EntryTextChip/EntryTextChip';

type EventDetailsFieldProps = {
  title: string;
  data: EventFieldMetadata[];
  isShownInExplorer: undefined | boolean;
};

export const EventDetailsField: React.FC<EventDetailsFieldProps> = props => {
  const { schemas, entries } = useSelector((state: RootState) => state.codex);

  const renderEntries = () => {
    const sortedData = [...props.data];
    sortedData.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    return sortedData.map(metadata => {
      if (metadata.type === 'string')
        return (
          <EntryTextChip
            key={metadata.sequenceNumber}
            title={metadata.value}
            isShownInExplorer={props.isShownInExplorer}
          />
        );

      const entry = convertEntriesHashMapToList(entries).find(
        element => element.id.toString() === metadata.value
      );
      const schema = schemas.find(element => element.id === entry?.schemaId);
      if (schema && entry)
        return (
          <EntryReferenceChip
            key={entry.id}
            entry={entry}
            schema={schema}
            isShownInExplorer={props.isShownInExplorer}
          />
        );
      return null;
    });
  };

  return (
    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
      <Typography
        variant={props.isShownInExplorer ? 'subtitle2' : 'subtitle1'}
        sx={{ color: 'customPalette.onBackgroundVariant', fontWeight: 'medium' }}
      >
        {props.title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: '5px' }}>{renderEntries()}</Box>
    </Stack>
  );
};
