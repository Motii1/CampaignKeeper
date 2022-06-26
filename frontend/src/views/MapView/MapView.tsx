import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { EventGraph } from './components/EventGraph/EventGraph';
import { fetchEvents } from './eventsSlice';
import { setSessionId } from './mapViewSlice';

export const MapView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSessionId } = useSelector((state: RootState) => state.mapView);
  const { isEventsListDownloaded } = useSelector((state: RootState) => state.events);
  const { sessionsList } = useSelector((state: RootState) => state.sessions);
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);

  const history = useHistory();

  if (currentCampaignId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!isEventsListDownloaded) {
    const sessionIdForFetching =
      currentSessionId !== '' ? currentSessionId : sessionsList[sessionsList.length - 1].id;
    dispatch(setSessionId({ currentSessionId: sessionIdForFetching }));
    dispatch(fetchEvents(sessionIdForFetching));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEvent);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

  const handleFab = () => {
    setIsOpen(true);
    setDialogType(NavBarViewDialog.NewEntry);
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
      <EventGraph setIsOpen={setIsOpen} setDialogType={setDialogType} />
    </ViewWithNavBarWrapper>
  );
};
