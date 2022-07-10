import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { EventTile } from '../components/EventTile/EventTile';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { SessionEventWithPos } from '../MapView/eventsSlice';
import { BackButton } from './components/BackButton/BackButton';
import { ParentDialog } from './components/ParentsDialog/ParentsDialog';
import { setCurrentEvent } from './explorerViewSlice';

export const ExplorerView: React.FC = () => {
  const dispatch = useDispatch();

  const { currentEvent } = useSelector((state: RootState) => state.explorerView);
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const [parentEvents, setParentEvents] = useState<SessionEventWithPos[]>([]);

  const handleParentButton = () => {
    if (currentEvent) {
      if (currentEvent.parentIds.length > 1) {
        const parentEvents = eventsList.filter(event => currentEvent.parentIds.includes(event.id));
        setParentEvents(parentEvents);
        setIsParentDialogOpen(true);
      } else {
        const parentEvent = eventsList.find(event => event.id === currentEvent.parentIds[0]);
        dispatch(setCurrentEvent({ currentEvent: parentEvent }));
      }
    }
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      {currentEvent ? (
        <Box>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
            <EventTile event={currentEvent} isShownInExplorer />
          </Stack>
          {currentEvent.parentIds.length > 0 ? (
            <>
              <BackButton handleClick={handleParentButton} />
              <ParentDialog
                parentEvents={parentEvents}
                isOpen={isParentDialogOpen}
                setIsOpen={setIsParentDialogOpen}
              />
            </>
          ) : null}
        </Box>
      ) : (
        <EmptyPlaceholder message={'Choose an event to explore it, voyager'} />
      )}
    </ViewWithNavBarWrapper>
  );
};
