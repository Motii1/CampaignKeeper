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
import { fetchCampaigns } from './campaignsSlice';

export const StartView: React.FC = () => {
  const dispatch = useDispatch();
  const { isCampaignListDownloaded, campaignsList } = useSelector(
    (state: RootState) => state.campaigns
  );
  if (!isCampaignListDownloaded) dispatch(fetchCampaigns());

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewCampaign);
    setIsOpen(true);
  };

  const centeredPadding = getCenteredPadding();

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
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: '100%', overflowY: 'auto' }}
      >
        <QuoteLine text={quote} />
        {campaignsList.length > 0 ? (
          <Box
            component="div"
            onWheel={handleWheelEvent}
            sx={{
              overflowY: 'hidden',
              alignItems: 'start',
              justifyContent: 'flex-start',
              display: 'flex',
              height: '100%',
              width: '100%',
              paddingTop: 5,
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
              {campaignsList.map(campaign => (
                <Grid item key={campaign.name}>
                  <CampaignTile
                    campaignId={campaign.id}
                    campaignName={campaign.name}
                    campaignImageBase64={campaign.imageBase64}
                    setIsOpen={setIsOpen}
                    setDialogType={setDialogType}
                    isClickable={true}
                  />
                </Grid>
              ))}
            </Grid>
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
            <EmptyPlaceholder message={'Go wild and start your new journey, worldshaper'} />
          </Box>
        )}
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
