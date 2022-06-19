import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { EventGraph } from './components/EventGraph/EventGraph';
import { fetchEvents, setSessionId } from './sessionSlice';

export const MapView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSessionId, isEventsListDownloaded } = useSelector(
    (state: RootState) => state.session
  );
  const { sessionsList } = useSelector((state: RootState) => state.sessions);
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);

  const history = useHistory();

  if (currentCampaignId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!isEventsListDownloaded) {
    const sessionIdForFetching =
      currentSessionId !== '' ? currentSessionId : sessionsList[sessionsList.length - 1].id;
    dispatch(fetchEvents(sessionIdForFetching));
    dispatch(setSessionId({ currentSessionId: sessionIdForFetching }));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEvent);

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      <EventGraph />
    </ViewWithNavBarWrapper>
  );
};
