import { useSelector } from 'react-redux';
import Xarrow, { anchorType } from 'react-xarrows';
import { RootState } from '../../../../../../../../store';

type EventArrowProps = {
  start: string;
  end: string;
  startAnchor: anchorType;
  endAnchor: anchorType;
};

export const EventArrow: React.FC<EventArrowProps> = props => {
  const { isLight } = useSelector((state: RootState) => state.theme);

  return (
    <Xarrow
      start={props.start}
      end={props.end}
      color={isLight ? '#303d50' : '#ffffff'}
      lineColor={isLight ? '#303d50' : '#ffffff'}
      headSize={4}
      path="smooth"
      curveness={1}
      startAnchor={props.startAnchor}
      endAnchor={props.endAnchor}
      zIndex={5000}
    />
  );
};
