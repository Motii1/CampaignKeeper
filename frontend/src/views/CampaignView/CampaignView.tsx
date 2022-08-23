import { Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { fetchSchemasAndEntries } from '../CodexView/codexSlice';
import { resetCurrent } from '../CodexView/codexViewSlice';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
import { CircleProgress } from '../components/CircleProgress/CircleProgress';
import { CustomGrid } from '../components/CustomGrid/CustomGrid';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { QuoteLine } from '../components/QuoteLine/QuoteLine';
import { quotes } from '../components/QuoteLine/quotes';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { updateSelectedCampaignData } from './campaignViewSlice';
import { SessionTile } from './components/SessionTile/SessionTile';
import { fetchSessions, updateCampaignId } from './sessionsSlice';

/**
 * Component responsible for UI and logic of CampaignView which displays campaign selected
 * by user in StartView (list of sessions in that campaign), allows creation of new sessions
 * and editing/deleting existing ones
 * @returns
 */
export const CampaignView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCampaignId, currentCampaignName, currentCampaignImageBase64 } = useSelector(
    (state: RootState) => state.campaignView
  );
  const { sessionsList, sessionsCampaignId, isSessionsListDownloaded } = useSelector(
    (state: RootState) => state.sessions
  );
  const { campaignsList } = useSelector((state: RootState) => state.campaigns);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewSession);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

  useEffect(() => {
    if (currentCampaignId === '') {
      const lastCampaign = campaignsList[campaignsList.length - 1];
      if (lastCampaign) {
        dispatch(
          updateSelectedCampaignData({
            campaignId: lastCampaign.id,
            campaignName: lastCampaign.name,
            campaignImageBase64: lastCampaign.imageBase64,
          })
        );
        dispatch(fetchSchemasAndEntries(lastCampaign.id));
      }
    } else if (!isSessionsListDownloaded || sessionsCampaignId !== currentCampaignId) {
      dispatch(fetchSessions(currentCampaignId));
      dispatch(fetchSchemasAndEntries(currentCampaignId));
      dispatch(resetCurrent({}));
      dispatch(updateCampaignId({ campaignId: currentCampaignId }));
    }
  }, [campaignsList, currentCampaignId, dispatch, isSessionsListDownloaded, sessionsCampaignId]);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewSession);
    setIsOpen(true);
  };

  const renderSessionsGrid = () => {
    if (isSessionsListDownloaded)
      return sessionsList.length > 0 ? (
        <Box
          component="div"
          sx={{
            overflowY: 'auto',
            alignItems: 'start-flex',
            justifyContent: 'center',
            display: 'flex',
            width: '100%',
            paddingTop: 0.8,
          }}
        >
          <CustomGrid>
            {sessionsList.map(session => (
              <Grid item key={session.name}>
                <SessionTile
                  sessionId={session.id}
                  sessionName={session.name}
                  setIsOpen={setIsOpen}
                  setDialogType={setDialogType}
                />
              </Grid>
            ))}
          </CustomGrid>
        </Box>
      ) : (
        <EmptyPlaceholder message={'Go wild and take a first step, worldshaper'} />
      );
    return <CircleProgress />;
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
      isSecondaryOpen={isSecondaryOpen}
      setIsSecondaryOpen={setIsSecondaryOpen}
      handleFab={currentCampaignId !== '' ? handleFab : undefined}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="start"
        sx={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <QuoteLine text={quote} />
        {currentCampaignId === '' ? (
          <EmptyPlaceholder message={"You haven't created any world, wordsmith"} />
        ) : (
          <Box
            component="div"
            sx={{
              overflowY: 'auto',
              alignItems: 'start-flex',
              justifyContent: 'center',
              display: 'flex',
              width: '100%',
              height: '100%',
              paddingTop: 0.8,
            }}
          >
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ width: '100%', height: '100%', paddingLeft: 0.8 }}
            >
              <CampaignTile
                campaignId={currentCampaignId}
                campaignName={currentCampaignName}
                campaignImageBase64={currentCampaignImageBase64}
                setIsOpen={setIsOpen}
                setDialogType={setDialogType}
                isClickable={false}
              />
              {renderSessionsGrid()}
            </Stack>
          </Box>
        )}
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
