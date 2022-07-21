import { Paper, Stack } from '@mui/material';
import { EventTileType } from '../../../../../types/types';
import { EventFieldMetadata } from '../../../../MapView/eventsSlice';
import { EventDescriptionField } from './components/EventDescriptionField/EventDescriptionField';
import { EventDetailsField } from './components/EventDetailsField/EventDetailsField';

type EventDetailsProps = {
  place: EventFieldMetadata[];
  characters: EventFieldMetadata[];
  description: EventFieldMetadata[];
  type: EventTileType;
};

export const EventDetails: React.FC<EventDetailsProps> = props => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: 'customPalette.tertiary',
      width: 'calc(100% - 14px)',
      borderRadius: 1.5,
      padding: '7px',
    }}
  >
    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
      <EventDetailsField title={'Place'} data={props.place} type={props.type} />
      <EventDetailsField title={'Characters'} data={props.characters} type={props.type} />
      <EventDescriptionField data={props.description} type={props.type} />
    </Stack>
  </Paper>
);
