import { Box } from '@mui/material';
import { EventArrow } from './components/EventArrow/EventArrow';
import { EventTile } from './components/EventTile/EventTile';

type EventWrapperProps = {
  id: string;
  title: string;
  parentIDs: string[];
};

// TO-DO: EventTiles should be shove ABOVE EventArrows
export const EventWrapper: React.FC<EventWrapperProps> = props => {
  const numberOfArrows = props.parentIDs.length;
  const a1 =
    numberOfArrows % 2 === 0 ? 0.5 * numberOfArrows * -10 : 0.5 * numberOfArrows * -20 + 10;
  const arrowsEndOffsets = [a1];
  for (let i = 1; i < numberOfArrows; i++) arrowsEndOffsets.push(a1 + i * 20);

  const renderArrows = () => {
    let currentArrow = 0;

    return props.parentIDs.map(parentId => {
      const offset = arrowsEndOffsets[currentArrow];
      currentArrow++;
      return (
        <EventArrow
          key={`${props.id}-${parentId}`}
          start={parentId}
          end={props.id}
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
      <EventTile id={props.id} title={props.title} />
      {renderArrows()}
    </Box>
  );
};
