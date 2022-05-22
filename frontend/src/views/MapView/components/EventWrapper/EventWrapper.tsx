import { Box } from '@mui/material';
import Xarrow from 'react-xarrows';
import { EventTile } from './components/EventTile/EventTile';

type EventWrapperProps = {
  id: string;
  title: string;
  parentIDs: string[];
};

export const EventWrapper: React.FC<EventWrapperProps> = props => {
  // const numberOfArrows = props.parentIDs.length;
  const arrowsEndOffsets = [-20, 20, 0, 0, 0];

  const renderArrows = () => {
    let currentArrow = 0;

    props.parentIDs.map(parentId => {
      const offset = arrowsEndOffsets[currentArrow];
      currentArrow++;
      return (
        <Xarrow
          key={`${props.id}-${parentId}`}
          start={parentId}
          end={props.id}
          color="#ffffff"
          headSize={4}
          path="straight"
          startAnchor="bottom"
          endAnchor={{
            position: 'top',
            offset: { x: offset },
          }}
          zIndex={0}
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
