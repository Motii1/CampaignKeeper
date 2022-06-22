import { Paper, Stack, Typography } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../../../types/types';
import { SessionEventWithPos } from '../../../../../../eventsSlice';
import { EventDetails } from './components/EventDetails/EventDetails';
import { EventMenu } from './components/EventMenu/EventMenu';

type EventTileProps = {
  id: string;
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EventTile: React.FC<EventTileProps> = props => (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: 'customPalette.accent',
      width: '400px',
      minHeight: '200px',
      '& .MuiBox-root': {
        '& .css-0': {
          zIndex: '5',
        },
      },
      position: 'relative',
    }}
    id={props.id}
  >
    <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={1}>
      <Typography sx={{ fontWeight: 'bold', color: 'customPalette.onAccent', marginTop: '5px' }}>
        {props.event.title}
      </Typography>
      <EventDetails
        place={props.event.placeMetadataArray}
        characters={props.event.charactersMetadataArray}
        description={props.event.descriptionMetadataArray}
      />
    </Stack>
    <EventMenu
      event={props.event}
      setIsOpen={props.setIsOpen}
      setDialogType={props.setDialogType}
    />
  </Paper>
);
