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
  const renderRootArrow = () => (
    <EventArrow
      key={`${props.event.id}-root-node`}
      start={'root-node'}
      end={`event-${props.event.id}`}
      endAnchor={{
        position: 'top',
        offset: { x: 0 },
      }}
    />
  );

  const renderChildArrows = () => {
    const numberOfArrows = props.event.parentIds.length;
    const a1 =
      numberOfArrows % 2 === 0 ? 0.5 * numberOfArrows * -10 : 0.5 * numberOfArrows * -20 + 10;
    const arrowsEndOffsets = [a1];
    for (let i = 1; i < numberOfArrows; i++) arrowsEndOffsets.push(a1 + i * 20);

    let currentArrow = 0;

    return props.event.childrenIds.map(childId => {
      const offset = arrowsEndOffsets[currentArrow];
      currentArrow++;
      // eslint-disable-next-line no-console
      console.log(`${props.event.title}-${childId}`);
      return (
        <EventArrow
          key={`${props.event.id}-${childId}`}
          start={`event-${props.event.id}`}
          end={`event-${childId}`}
          endAnchor={{
            position: 'top',
            offset: { x: offset },
          }}
        />
      );
    });
  };

  return props.event.displayStatus === 'shown' || props.event.displayStatus === 'collapsed' ? (
    <Box>
      {props.event.parentIds.length === 0 ? renderRootArrow() : null}
      <EventTile
        id={`event-${props.event.id}`}
        event={props.event}
        setIsOpen={props.setIsOpen}
        setDialogType={props.setDialogType}
      />
      {props.event.displayStatus === 'shown' ? renderChildArrows() : null}
    </Box>
  ) : null;
};
