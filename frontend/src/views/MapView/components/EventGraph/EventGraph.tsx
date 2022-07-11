import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useXarrow } from 'react-xarrows';
import { RootState } from '../../../../store';
import { NavBarViewDialog } from '../../../../types/types';
import { compareEventsByX } from '../../../../utils/utils';
import { CircleProgress } from '../../../components/CircleProgress/CircleProgress';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
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

  const renderRow = useCallback(
    (nodes: SessionEventWithPos[]) => {
      const nodesCopy = nodes;
      nodesCopy.sort(compareEventsByX);
      return (
        <Stack
          key={nodes[0].y}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={4}
        >
          {nodesCopy.map(node => (
            <EventWrapper
              key={`event-node-key-${node.id}`}
              event={node}
              eventsList={eventsList}
              setIsOpen={props.setIsOpen}
              setDialogType={props.setDialogType}
            />
          ))}
        </Stack>
      );
    },
    [eventsList, props.setDialogType, props.setIsOpen]
  );

  // TO-DO: show "Add an event, Grand Designer" when there are no events
  const renderGraph = useCallback(() => {
    if (eventsList.length === 0)
      return (
        <EmptyPlaceholder
          message={'Begin this adventure by adding its starting point, explorer!'}
        />
      );

    const queue: SessionEventWithPos[] = eventsList.filter(event => event.parentIds.length === 0);
    const eventToShowSet: Set<SessionEventWithPos> = new Set(queue);
    while (queue.length > 0) {
      const currentEvent = queue.shift();
      if (currentEvent) {
        eventToShowSet.add(currentEvent);
        if (currentEvent && currentEvent?.displayStatus === 'shown') {
          queue.push(...eventsList.filter(event => currentEvent.childrenIds.includes(event.id)));
        }
      }
    }

    const eventsToShow = Array.from(eventToShowSet);
    const maxRow = Math.max(...eventsToShow.map((event: SessionEventWithPos) => event.y));
    const rowIndexes = Array.from(Array(maxRow + 1).keys());

    return (
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
        {rowIndexes.map(index =>
          renderRow(eventsToShow.filter((node: SessionEventWithPos) => node.y === index))
        )}
      </Stack>
    );
  }, [eventsList, renderRow]);

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
      {renderGraph()}
    </div>
  ) : (
    <CircleProgress />
  );
};
