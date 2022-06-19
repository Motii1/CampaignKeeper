import { Paper, Stack } from '@mui/material';
import { EventFieldMetadata } from '../../../../../../../../sessionSlice';
import { EventDescriptionField } from './components/EventDescriptionField/EventDescriptionField';
import { EventDetailsDivider } from './components/EventDetailsDivider/EventDetailsDivider';
import { EventDetailsField } from './components/EventDetailsField/EventDetailsField';

type EventDetailsProps = {
  place: EventFieldMetadata[];
  characters: EventFieldMetadata[];
  description: EventFieldMetadata[];
};

export const EventDetails: React.FC<EventDetailsProps> = props => (
  <Paper
    sx={{
      backgroundColor: 'customPalette.surfaceSecondary',
      margin: '5px',
      width: '390px',
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      spacing={1}
      sx={{ margin: '4px' }}
    >
      <EventDetailsField title={'Place'} data={props.place} />
      <EventDetailsDivider />
      <EventDetailsField title={'Characters'} data={props.characters} />
      <EventDetailsDivider />
      <EventDescriptionField title={'Description'} data={props.description} />
    </Stack>
  </Paper>
);
