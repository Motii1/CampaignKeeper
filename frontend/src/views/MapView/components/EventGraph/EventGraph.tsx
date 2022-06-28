import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useXarrow } from 'react-xarrows';
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
  const { isLight } = useSelector((state: RootState) => state.theme);
  const updateXarrow = useXarrow();

  const renderRow = (nodes: SessionEventWithPos[]) => (
    <Stack
      key={nodes[0].y}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={4}
    >
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleScroll = (_event: React.UIEvent<HTMLElement>) => {
    updateXarrow();
  };

  return isEventsListDownloaded ? (
    <div
      onScroll={handleScroll}
      className={isLight ? '' : 'dark-div'}
      style={{
        backgroundColor: 'transparent',
        width: '100%',
        maxWidth: '100%',
        height: 'calc(100vh - 50px)',
        maxHeight: 'calc(100vh - 50px)',
        overflow: 'auto',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        sx={{
          padding: '20px',
          paddingTop: '50px',
          width: 'max-content',
          minWidth: 'calc(100% - 40px)',
          maxWidth: 'max-content',
          height: 'max-content',
          maxHeight: 'max-content',
        }}
      >
        <RootNode />
        {renderRows()}
      </Stack>
    </div>
  ) : (
    <CircleProgress />
  );
};
