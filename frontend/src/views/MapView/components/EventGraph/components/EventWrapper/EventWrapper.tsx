import { Box } from '@mui/material';
import { EventArrow } from './components/EventArrow/EventArrow';
import { EventTile } from './components/EventTile/EventTile';

type EventWrapperProps = {
  id: string;
  title: string;
  parentIds: string[];
};

// TO-DO: EventTiles should be shown ABOVE EventArrows
export const EventWrapper: React.FC<EventWrapperProps> = props => {
  const numberOfArrows = props.parentIds.length;
  const a1 =
    numberOfArrows % 2 === 0 ? 0.5 * numberOfArrows * -10 : 0.5 * numberOfArrows * -20 + 10;
  const arrowsEndOffsets = [a1];
  for (let i = 1; i < numberOfArrows; i++) arrowsEndOffsets.push(a1 + i * 20);

  const renderArrows = () => {
    // eslint-disable-next-line no-console
    console.log(props.id, props.parentIds);
    if (props.parentIds.length === 0)
      return (
        <EventArrow
          key={`${props.id}-root`}
          start="root-node"
          end={`event-${props.id}`}
          endAnchor={{
            position: 'top',
            offset: { x: 0 },
          }}
        />
      );

    let currentArrow = 0;

    return props.parentIds.map(parentId => {
      const offset = arrowsEndOffsets[currentArrow];
      currentArrow++;
      return (
        <EventArrow
          key={`${props.id}-${parentId}`}
          start={`event-${parentId}`}
          end={`event-${props.id}`}
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
      <EventTile id={`event-${props.id}`} title={props.title} />
      {renderArrows()}
    </Box>
  );
};
