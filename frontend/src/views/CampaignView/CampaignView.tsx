import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
import { CustomGrid } from '../components/CustomGrid/CustomGrid';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { QuoteLine } from '../components/QuoteLine/QuoteLine';
import { quotes } from '../components/QuoteLine/quotes';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { updateSelectedCampaignData } from './campaignViewSlice';
import { SessionTile } from './components/SessionTile/SessionTile';
import { fetchSessions, updateCampaignId } from './sessionsSlice';

export const CampaignView: React.FC = () => {
  const dispatch = useDispatch();
  const { campaignId, campaignName, campaignImageBase64 } = useSelector(
    (state: RootState) => state.campaignView
  );
  const campaigns = useSelector((state: RootState) => state.campaigns.campaignsList);
  if (campaignId === -1) {
    const lastCampaign = campaigns[campaigns.length - 1];
    if (lastCampaign) {
      dispatch(
        updateSelectedCampaignData({
          campaignId: lastCampaign.id,
          campaignName: lastCampaign.name,
          campaignImageBase64: lastCampaign.imageBase64,
        })
      );
    }
  }

  const { sessionsList, isSessionsListDownloaded, sessionsCampaignId } = useSelector(
    (state: RootState) => state.sessions
  );
  if ((!isSessionsListDownloaded || sessionsCampaignId !== campaignId) && campaignId !== -1) {
    dispatch(fetchSessions(campaignId));
    dispatch(updateCampaignId({ campaignId: campaignId }));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewSession);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

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
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EmptyPlaceholder message={'Go wild and take a first step, worldshaper'} />
        </Box>
      );
    return (
      <CircularProgress
        size={64}
        thickness={6}
        sx={{ color: 'customPalette.onBackground', margin: 'auto' }}
      />
    );
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
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="start"
        sx={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <QuoteLine text={quote} />
        {campaignId === -1 ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmptyPlaceholder message={"You haven't created any world, wordsmith"} />
          </Box>
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
                campaignId={campaignId}
                campaignName={campaignName}
                campaignImageBase64={campaignImageBase64}
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
