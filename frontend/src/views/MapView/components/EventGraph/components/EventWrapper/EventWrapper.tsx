import { Box } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../types/types';
import { compareEventsByXThenId } from '../../../../../../utils/utils';
import { SessionEventWithPos } from '../../../../eventsSlice';
import { EventArrow } from './components/EventArrow/EventArrow';
import { EventTile } from './components/EventTile/EventTile';

type EventWrapperProps = {
  event: SessionEventWithPos;
  eventsList: SessionEventWithPos[];
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

const arrowColors = ['#6E85B7', '#B2C8DF', '#C4D7E0', '#F8F9D7'];

const getOffsets = (numberOfArrows: number) => {
  const firstOffset =
    numberOfArrows % 2 === 0 ? 0.5 * numberOfArrows * -10 + 5 : 0.5 * numberOfArrows * -20 + 10;
  const arrowsEndOffsets = [firstOffset];
  for (let i = 1; i < numberOfArrows; i++) arrowsEndOffsets.push(firstOffset + i * 20);
  return arrowsEndOffsets;
};

export const EventWrapper: React.FC<EventWrapperProps> = props => {
  const renderRootArrow = () => (
    <EventArrow
      key={`${props.event.id}-root-node`}
      start={'root-node'}
      end={`event-${props.event.id}`}
      startAnchor="bottom"
      endAnchor="top"
    />
  );

  const renderChildArrows = () => {
    const startAnchorOffsets = getOffsets(props.event.childrenIds.length);

    let currentArrow = 0;
    return props.event.childrenIds.map(childId => {
      const startOffset = startAnchorOffsets[currentArrow];

      const childParents = props.eventsList.filter(event => event.childrenIds.includes(childId));
      childParents.sort(compareEventsByXThenId);
      const endAnchorOffsets = getOffsets(childParents.length);
      const currentEventIndexOnParentList = childParents.indexOf(props.event);
      const endOffset = endAnchorOffsets[currentEventIndexOnParentList];

      currentArrow++;
      return (
        <EventArrow
          key={`${props.event.id}-${childId}`}
          start={`event-${props.event.id}`}
          end={`event-${childId}`}
          startAnchor={{
            position: 'bottom',
            offset: { x: startOffset },
          }}
          endAnchor={{
            position: 'top',
            offset: { x: endOffset },
          }}
          color={arrowColors[currentEventIndexOnParentList % 4]}
        />
      );
    });
  };

  return (
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
  );
};
