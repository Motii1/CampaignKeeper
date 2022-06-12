import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { EventWrapper } from './components/EventWrapper/EventWrapper';
import { EventNode, shortGraphNodes } from './eventNodes';
import { setYPositions } from './graphExperiments';
import { fetchEvents } from './sessionSlice';

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
    // eslint-disable-next-line no-console
    console.log('WORKS');
    const sessionIdForFetching =
      currentSessionId !== '' ? currentSessionId : sessionsList[sessionsList.length - 1].id;
    dispatch(fetchEvents(sessionIdForFetching));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEvent);

  const eventNodes = setYPositions(shortGraphNodes);

  const renderRow = (nodes: EventNode[]) => (
    <Stack key={nodes[0].y} direction="row" justifyContent="center" alignItems="center" spacing={4}>
      {nodes.map(node => (
        <EventWrapper key={node.id} id={node.id} title={node.title} parentIDs={node.parentIDs} />
      ))}
    </Stack>
  );

  const renderEventGraphNodes = () => {
    const maxRow = Math.max(...eventNodes.map(node => node.y));
    const rowIndexes = Array.from(Array(maxRow + 1).keys());

    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        sx={{ marginTop: '50px' }}
      >
        {rowIndexes.map(index => renderRow(eventNodes.filter(node => node.y === index)))}
      </Stack>
    );
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      {renderEventGraphNodes()}
    </ViewWithNavBarWrapper>
  );
};
