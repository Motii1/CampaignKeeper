import { Box, Paper, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { EventTileType, NavBarViewDialog } from '../../../types/types';
import { setCurrentEvent } from '../../ExplorerView/explorerViewSlice';
import { SessionEventWithPos } from '../../MapView/eventsSlice';
import { EventBar } from './components/EventBar/EventBar';
import { EventDetails } from './components/EventDetails/EventDetails';

type EventTileProps = {
  id?: string;
  event: SessionEventWithPos;
  setIsOpen?: (newIsOpen: boolean) => void;
  setDialogType?: (newDialogType: NavBarViewDialog) => void;
  type: EventTileType;
};

/**
 * Component used to display event content (its title, characters, places, description).
 * In MapView allows changing editing event and changing its execution status and display status.
 * NOTE1: EventTile is used in both MapView (as part of graph) and ExplorerView (selected event
 * displayed in center of the view and parent/children events in corresponding dialog)
 * and therefore has props allowing control of its UI and styling.
 * NOTE2: In MapView if Event display status is set to hidden
 * only its header (EventBar) is shown to user.
 * @param props
 * @returns
 */
export const EventTile: React.FC<EventTileProps> = props => {
  const dispatch = useDispatch();

  const handleTileClick = () => {
    if (props.type === EventTileType.ExplorerDialog && props.setIsOpen) {
      dispatch(setCurrentEvent({ currentEvent: props.event }));
      props.setIsOpen(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor:
          props.event.type === 'normal' ? 'customPalette.accent' : 'customPalette.red',
        borderRadius: 2,
        width:
          props.type === EventTileType.Explorer
            ? '800px'
            : props.type === EventTileType.Map
            ? '400px'
            : '350px',
        '& .MuiBox-root': {
          '& .css-0': {
            zIndex: '5',
          },
        },
        cursor: props.type === EventTileType.ExplorerDialog ? 'pointer' : 'default',
        position: 'relative',
        opacity: props.event.status === 'none' || props.type !== EventTileType.Map ? '1' : '0.8',
      }}
      id={props.id}
      onClick={props.type === EventTileType.ExplorerDialog ? handleTileClick : undefined}
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
        <EventBar
          event={props.event}
          setIsOpen={props.setIsOpen}
          setDialogType={props.setDialogType}
          type={props.type}
        />
        {props.event.displayStatus === 'shown' || props.type !== EventTileType.Map ? (
          <Box
            sx={{
              maxHeight: 'min-content',
              width: '100%',
              paddingTop: 0.7,
            }}
          >
            <EventDetails
              type={props.type}
              place={props.event.placeMetadataArray}
              characters={props.event.charactersMetadataArray}
              description={props.event.descriptionMetadataArray}
            />
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
};
