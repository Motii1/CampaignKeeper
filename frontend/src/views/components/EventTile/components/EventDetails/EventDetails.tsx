import { Paper, Stack } from '@mui/material';
import { EventFieldMetadata } from '../../../../MapView/eventsSlice';
import { EventDescriptionField } from './components/EventDescriptionField/EventDescriptionField';
import { EventDetailsField } from './components/EventDetailsField/EventDetailsField';

type EventDetailsProps = {
  place: EventFieldMetadata[];
  characters: EventFieldMetadata[];
  description: EventFieldMetadata[];
  isShownInExplorer?: boolean;
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
      <EventDetailsField
        title={'Place'}
        data={props.place}
        isShownInExplorer={props.isShownInExplorer}
      />
      <EventDetailsField
        title={'Characters'}
        data={props.characters}
        isShownInExplorer={props.isShownInExplorer}
      />
      <EventDescriptionField
        title={'Description'}
        data={props.description}
        isShownInExplorer={props.isShownInExplorer}
      />
    </Stack>
  </Paper>
);
