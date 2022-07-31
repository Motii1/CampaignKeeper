import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { setSessionId } from '../ExplorerView/explorerViewSlice';
import viewsRoutes from '../viewsRoutes';
import { EventGraph } from './components/EventGraph/EventGraph';
import { fetchEvents } from './eventsSlice';
import { setCurrentSession } from './mapViewSlice';

/**
 * Component responsible for UI and logic of MapView which displays graph of events
 * from currently selected session, allows creation of new events
 * and editing/removing existing ones
 */
export const MapView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSessionId, currentSessionTitle } = useSelector(
    (state: RootState) => state.mapView
  );
  const { isEventsListDownloaded } = useSelector((state: RootState) => state.events);
  const { sessionsList } = useSelector((state: RootState) => state.sessions);
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);

  const history = useHistory();

  if (currentCampaignId === '' || currentSessionId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!isEventsListDownloaded) {
    const sessionIdForFetching =
      currentSessionId !== '' ? currentSessionId : sessionsList[sessionsList.length - 1]?.id;
    if (sessionIdForFetching) {
      dispatch(
        setCurrentSession({
          currentSessionId: sessionIdForFetching,
          currentSessionTitle: sessionsList.find(session => session.id === sessionIdForFetching)
            ?.name,
        })
      );
      dispatch(setSessionId({ currentSessionId: sessionIdForFetching }));
      dispatch(fetchEvents(sessionIdForFetching));
    } else history.push(viewsRoutes.CAMPAIGN);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEvent);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewEvent);
    setIsOpen(true);
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
      isSecondaryOpen={isSecondaryOpen}
      setIsSecondaryOpen={setIsSecondaryOpen}
      handleFab={handleFab}
    >
      <EventGraph
        sessionName={currentSessionTitle}
        setIsOpen={setIsOpen}
        setDialogType={setDialogType}
      />
    </ViewWithNavBarWrapper>
  );
};
