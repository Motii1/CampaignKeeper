import { Box, Paper, Stack } from '@mui/material';
import { NavBarViewDialog } from '../../../types/types';
import { SessionEventWithPos } from '../../MapView/eventsSlice';
import { EventDetails } from './components/EventDetails/EventDetails';
import { EventMenu } from './components/EventMenu/EventMenu';

type EventTileProps = {
  id?: string;
  event: SessionEventWithPos;
  setIsOpen?: (newIsOpen: boolean) => void;
  setDialogType?: (newDialogType: NavBarViewDialog) => void;
  isShownInExplorer?: boolean;
};

export const EventTile: React.FC<EventTileProps> = props => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: props.event.type === 'normal' ? 'customPalette.accent' : 'customPalette.red',
      borderRadius: 2,
      width: props.isShownInExplorer ? '800px' : '400px',
      //minHeight: props.event.displayStatus === 'shown' ? '200px' : '30px',
      '& .MuiBox-root': {
        '& .css-0': {
          zIndex: '5',
        },
      },
      position: 'relative',
      opacity: props.event.status === 'none' || props.isShownInExplorer ? '1' : '0.8',
    }}
    id={props.id ? props.id : 'event-tile-explorer-view'}
  >
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
      sx={{
        padding: 0.7,
      }}
    >
      <EventMenu
        event={props.event}
        setIsOpen={props.setIsOpen}
        setDialogType={props.setDialogType}
        isShownInExplorer={props.isShownInExplorer}
      />
      {props.event.displayStatus === 'shown' ? (
        <Box
          sx={{
            maxHeight: props.event.displayStatus === 'shown' ? 'min-content' : '0px',
            width: '100%',
            paddingTop: 0.7,
          }}
        >
          <EventDetails
            place={props.event.placeMetadataArray}
            characters={props.event.charactersMetadataArray}
            description={props.event.descriptionMetadataArray}
          />
        </Box>
      ) : null}
    </Stack>
  </Paper>
);
