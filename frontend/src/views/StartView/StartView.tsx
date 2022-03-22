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

  // TO-DO: maybe we need small, medium, large CustomCircularProgress components?
  const renderCampaignsGrid = () => {
    if (isCampaignListDownloaded)
      return campaignsList.length > 0 ? (
        <Box
          component="div"
          sx={{
            overflowY: 'auto',
            alignItems: 'start-flex',
            justifyContent: 'center',
            display: 'flex',
            height: '100%',
            width: '100%',
            paddingTop: 0.8,
          }}
        >
          <CustomGrid>
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
          <EmptyPlaceholder message={'Go wild and start your new journey, worldshaper'} />
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
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', overflowY: 'auto' }}
      >
        <QuoteLine text={quote} />
        {renderCampaignsGrid()}
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
