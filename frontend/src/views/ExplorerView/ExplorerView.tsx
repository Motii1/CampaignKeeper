import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { EventTileType, NavBarViewDialog } from '../../types/types';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { EventTile } from '../components/EventTile/EventTile';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { SessionEventWithPos } from '../MapView/eventsSlice';
import viewsRoutes from '../viewsRoutes';
import { BackButton } from './components/BackButton/BackButton';
import { ChildrenSelect } from './components/Children/ChildrenSelect';
import { ParentDialog } from './components/ParentsDialog/ParentsDialog';
import { setCurrentEvent } from './explorerViewSlice';

export const ExplorerView: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { currentEvent, currentSessionId } = useSelector((state: RootState) => state.explorerView);
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const [parentEvents, setParentEvents] = useState<SessionEventWithPos[]>([]);

  if (currentSessionId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!currentEvent) {
    const rootEvent = eventsList.find(event => event.parentIds.length === 0);
    if (rootEvent) dispatch(setCurrentEvent({ currentEvent: rootEvent }));
  }

  const handleFab = () => {
    if (currentEvent) setIsOpen(true);
  };

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
      handleFab={handleFab}
    >
      {currentEvent ? (
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={4}
          sx={{
            overflowY: 'auto',
            overflowX: 'hidden',
            marginTop: '150px',
          }}
        >
          <EventTile event={currentEvent} type={EventTileType.Explorer} />
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
          <ChildrenSelect
            currentSessionId={currentSessionId}
            currentEvent={currentEvent}
            eventsList={eventsList}
          />
        </Stack>
      ) : (
        <EmptyPlaceholder message={'Create an event to explore it, voyager'} />
      )}
    </ViewWithNavBarWrapper>
  );
};
