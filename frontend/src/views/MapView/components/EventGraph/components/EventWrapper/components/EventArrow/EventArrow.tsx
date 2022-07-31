import { useSelector } from 'react-redux';
import Xarrow, { anchorType } from 'react-xarrows';
import { RootState } from '../../../../../../../../store';

export type EventArrowProps = {
  start: string;
  end: string;
  startAnchor: anchorType;
  endAnchor: anchorType;
  index: number;
};

const getColorOpacity = (index: number) => {
  if (index % 4 === 0) return 'FF';
  if (index % 4 === 1) return 'D4';
  if (index % 4 === 2) return 'AB';
  return '80';
};

/**
 * Arrow made with react-xarrows library
 * used to connect parent event (or root)
 * with its children.
 * @param props
 * @returns
 */
// eslint-disable-next-line arrow-body-style
export const EventArrow: React.FC<EventArrowProps> = props => {
  const { isLight } = useSelector((state: RootState) => state.theme);
  const arrowColor = isLight ? '#303d50' : '#f4f4f4';
  const colorOpacity = getColorOpacity(props.index);

  return (
    <Xarrow
      start={props.start}
      end={props.end}
      color={arrowColor.concat(colorOpacity)}
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
