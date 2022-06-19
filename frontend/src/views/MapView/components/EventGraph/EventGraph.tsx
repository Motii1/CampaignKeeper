import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CircleProgress } from '../../../components/CircleProgress/CircleProgress';
import { SessionEventWithPos } from '../../sessionSlice';
import { EventWrapper } from './components/EventWrapper/EventWrapper';
import { RootNode } from './components/RootNode/RootNode';

export const EventGraph: React.FC = () => {
  const { eventsList, isEventsListDownloaded } = useSelector((state: RootState) => state.session);

  const renderRow = (nodes: SessionEventWithPos[]) => (
    <Stack key={nodes[0].y} direction="row" justifyContent="center" alignItems="center" spacing={4}>
      {nodes.map(node => (
        <EventWrapper key={node.id} id={node.id} title={node.title} parentIds={node.parentIds} />
      ))}
    </Stack>
  );

  const renderRows = () => {
    if (!isEventsListDownloaded) return null;

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
