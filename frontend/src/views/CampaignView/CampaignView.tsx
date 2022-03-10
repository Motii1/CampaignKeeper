import { Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { getCenteredPadding, handleWheelEvent } from '../../utils/utils';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { QuoteLine } from '../components/QuoteLine/QuoteLine';
import { quotes } from '../components/QuoteLine/quotes';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { updateSelectedCampaignData } from './campaignViewSlice';
import { SessionTile } from './components/SessionTile/SessionTile';

export const CampaignView: React.FC = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

  const { campaignId, campaignName, campaignImageBase64, sessionsNames } = useSelector(
    (state: RootState) => state.campaignView
  );
  const campaigns = useSelector((state: RootState) => state.campaigns.campaignsList);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewCampaign);
    setIsOpen(true);
  };

  const centeredPadding = getCenteredPadding();

  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
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
  }, [campaignId, campaigns, dispatch]);

  return (
    <ViewWithNavBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogType={dialogType}
      setDialogType={setDialogType}
      isSecondaryOpen={isSecondaryOpen}
      setIsSecondaryOpen={setIsSecondaryOpen}
      handleFab={handleFab}
    >
      {campaignId === -1 ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', height: '100%', overflowY: 'auto' }}
        >
          <QuoteLine text={quote} />
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmptyPlaceholder message={"You haven't selected world to explore, wordsmith"} />
          </Box>
        </Stack>
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', overflowY: 'auto' }}
        >
          <QuoteLine text={quote} />
          <CampaignTile
            campaignId={campaignId}
            campaignName={campaignName}
            campaignImageBase64={campaignImageBase64}
            setIsOpen={setIsOpen}
            setDialogType={setDialogType}
          />
          <Box
            component="div"
            onWheel={handleWheelEvent}
            sx={{
              overflowY: 'hidden',
              alignItems: 'center',
              justifyContent: 'flex-start',
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              columnSpacing={10}
              sx={{
                maxHeight: '100%',
                width: 'auto',
                maxWidth: '100%',
                paddingLeft: centeredPadding + 'px',
              }}
            >
              {sessionsNames.map(title => (
                <Grid item key={title}>
                  <SessionTile
                    sessionTitle={title}
                    setIsOpen={setIsOpen}
                    setDialogType={setDialogType}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      )}
    </ViewWithNavBarWrapper>
  );
};
