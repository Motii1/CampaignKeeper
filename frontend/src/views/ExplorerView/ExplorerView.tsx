import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { EventTile } from '../components/EventTile/EventTile';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { SessionEventWithPos } from '../MapView/eventsSlice';

export const ExplorerView: React.FC = () => {
  const { currentEventId } = useSelector((state: RootState) => state.explorerView);
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  const [currentEvent, setCurrentEvent] = useState<undefined | SessionEventWithPos>(
    eventsList.find(event => event.id === currentEventId)
  );

  useEffect(() => {
    const currentEventUpdated = eventsList.find(event => event.id === currentEventId);
    setCurrentEvent(currentEventUpdated);
  }, [currentEventId, eventsList]);

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      {currentEvent ? (
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <EventTile event={currentEvent} isShownInExplorer />
        </Stack>
      ) : (
        <EmptyPlaceholder message={'Choose an event to explore it, voyager'} />
      )}
    </ViewWithNavBarWrapper>
  );
};
