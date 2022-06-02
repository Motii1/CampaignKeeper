import { Paper, Stack } from '@mui/material';
import { EventDetailsDivider } from './components/EventDetailsDivider/EventDetailsDivider';
import { EventDetailsField } from './components/EventDetailsField/EventDetailsField';

export const EventDetails: React.FC = () => (
  <Paper
    sx={{
      backgroundColor: 'customPalette.surfaceSecondary',
      margin: '5px',
      width: '290px',
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      spacing={1}
      sx={{ margin: '4px' }}
    >
      <EventDetailsField title={'Place'} />
      <EventDetailsDivider />
      <EventDetailsField title={'Characters'} />
      <EventDetailsDivider />
      <EventDetailsField title={'Description'} />
    </Stack>
  </Paper>
);
