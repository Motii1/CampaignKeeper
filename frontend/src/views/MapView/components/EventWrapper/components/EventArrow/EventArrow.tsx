import Xarrow, { anchorType } from 'react-xarrows';

type EventArrowProps = {
  start: string;
  end: string;
  endAnchor: anchorType;
};

export const EventArrow: React.FC<EventArrowProps> = props => (
  <Xarrow
    start={props.start}
    end={props.end}
    color="#ffffff"
    headSize={4}
    path="smooth"
    curveness={1}
    startAnchor="bottom"
    endAnchor={props.endAnchor}
    zIndex={-1}
  />
);
