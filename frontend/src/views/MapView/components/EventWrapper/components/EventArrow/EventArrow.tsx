import Xarrow, { anchorType } from 'react-xarrows';

type EventArrowProps = {
  id: string;
  parentId: string;
  endAnchor: anchorType;
};

export const EventArrow: React.FC<EventArrowProps> = props => (
  <Xarrow
    key={`${props.id}-${props.parentId}`}
    start={props.parentId}
    end={props.id}
    color="#ffffff"
    headSize={4}
    path="straight"
    startAnchor="bottom"
    endAnchor={props.endAnchor}
    zIndex={0}
  />
);
