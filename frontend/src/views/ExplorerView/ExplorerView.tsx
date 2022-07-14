import { Box, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { EventTileType, NavBarViewDialog } from '../../types/types';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { EventTile } from '../components/EventTile/EventTile';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { OtherEventsPanel } from './components/OtherEventsPanel/OtherEventsPanel';
import { setCurrentEvent } from './explorerViewSlice';

export const ExplorerView: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { currentEvent, currentSessionId } = useSelector((state: RootState) => state.explorerView);
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  if (currentSessionId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!currentEvent) {
    const rootEvent = eventsList.find(event => event.parentIds.length === 0);
    if (rootEvent) dispatch(setCurrentEvent({ currentEvent: rootEvent }));
  }

  const handleFab = () => {
    if (currentEvent) setIsOpen(true);
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
      handleFab={currentEvent ? handleFab : undefined}
    >
      {currentEvent ? (
        <Paper
          elevation={0}
          sx={{
            height: 'calc(100vh - 50px)',
            maxHeight: 'calc(100vh - 50px)',
            overflowY: 'auto',
            backgroundColor: 'transparent',
          }}
        >
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={4}
            sx={{
              height: 'max-content',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingBottom: '250px',
            }}
          >
            <Box sx={{ height: 'calc(100vh * 0.09)' }} />
            <EventTile event={currentEvent} type={EventTileType.Explorer} />
            <OtherEventsPanel
              currentSessionId={currentSessionId}
              currentEvent={currentEvent}
              eventsList={eventsList}
            />
          </Stack>
        </Paper>
      ) : (
        <EmptyPlaceholder message={'Create an event to explore it, voyager'} />
      )}
    </ViewWithNavBarWrapper>
  );
};
