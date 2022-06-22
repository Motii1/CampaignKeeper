import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { NavBarViewDialog } from '../../../../types/types';
import { CircleProgress } from '../../../components/CircleProgress/CircleProgress';
import { SessionEventWithPos } from '../../eventsSlice';
import { EventWrapper } from './components/EventWrapper/EventWrapper';
import { RootNode } from './components/RootNode/RootNode';

type EventGraphProsp = {
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EventGraph: React.FC<EventGraphProsp> = props => {
  const { isEventsListDownloaded, eventsList } = useSelector((state: RootState) => state.events);

  const renderRow = (nodes: SessionEventWithPos[]) => (
    <Stack key={nodes[0].y} direction="row" justifyContent="center" alignItems="center" spacing={4}>
      {nodes.map(node => (
        <EventWrapper
          key={`event-node-key-${node.id}`}
          event={node}
          setIsOpen={props.setIsOpen}
          setDialogType={props.setDialogType}
        />
      ))}
    </Stack>
  );

  // TO-DO: show "Add an event, Grand Designer" when there are no events
  const renderRows = () => {
    if (eventsList.length === 0) return null;

    const maxRow = Math.max(...eventsList.map((event: SessionEventWithPos) => event.y));
    const rowIndexes = Array.from(Array(maxRow + 1).keys());

    return rowIndexes.map(index =>
      renderRow(eventsList.filter((node: SessionEventWithPos) => node.y === index))
    );
  };

  return isEventsListDownloaded ? (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={8}
      sx={{ marginTop: '50px' }}
    >
      <RootNode />
      {renderRows()}
    </Stack>
  ) : (
    <CircleProgress />
  );
};
