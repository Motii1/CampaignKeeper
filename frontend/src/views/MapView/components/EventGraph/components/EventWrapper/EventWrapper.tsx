import { Box } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../types/types';
import { SessionEventWithPos } from '../../../../eventsSlice';
import { EventArrow } from './components/EventArrow/EventArrow';
import { EventTile } from './components/EventTile/EventTile';

type EventWrapperProps = {
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

// TO-DO: EventTiles should be shown ABOVE EventArrows
export const EventWrapper: React.FC<EventWrapperProps> = props => {
  const numberOfArrows = props.event.parentIds.length;
  const a1 =
    numberOfArrows % 2 === 0 ? 0.5 * numberOfArrows * -10 : 0.5 * numberOfArrows * -20 + 10;
  const arrowsEndOffsets = [a1];
  for (let i = 1; i < numberOfArrows; i++) arrowsEndOffsets.push(a1 + i * 20);

  const renderArrows = () => {
    if (props.event.parentIds.length === 0)
      return (
        <EventArrow
          key={`${props.event.id}-root`}
          start="root-node"
          end={`event-${props.event.id}`}
          endAnchor="top"
        />
      );

    let currentArrow = 0;

    return props.event.parentIds.map(parentId => {
      const offset = arrowsEndOffsets[currentArrow];
      currentArrow++;
      return (
        <EventArrow
          key={`${props.event.id}-${parentId}`}
          start={`event-${parentId}`}
          end={`event-${props.event.id}`}
          endAnchor={{
            position: 'top',
            offset: { x: offset },
          }}
        />
      );
    });
  };

  return (
    <Box>
      <EventTile
        id={`event-${props.event.id}`}
        event={props.event}
        setIsOpen={props.setIsOpen}
        setDialogType={props.setDialogType}
      />
      {renderArrows()}
    </Box>
  );
};
