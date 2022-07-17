import { useSelector } from 'react-redux';
import Xarrow, { anchorType } from 'react-xarrows';
import { RootState } from '../../../../../../../../store';

export type EventArrowProps = {
  start: string;
  end: string;
  startAnchor: anchorType;
  endAnchor: anchorType;
  color?: string;
};

export const EventArrow: React.FC<EventArrowProps> = props => {
  const { isLight } = useSelector((state: RootState) => state.theme);
  const arrowColor = props.color ? props.color : isLight ? '#303d50' : '#ffffff';

  return (
    <Xarrow
      start={props.start}
      end={props.end}
      color={arrowColor}
      lineColor={arrowColor}
      headSize={4}
      showTail={true}
      tailShape="circle"
      tailSize={2}
      path="smooth"
      curveness={1}
      startAnchor={props.startAnchor}
      endAnchor={props.endAnchor}
      zIndex={-10}
    />
  );
};
