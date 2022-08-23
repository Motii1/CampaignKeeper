import { Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
import { CircleProgress } from '../components/CircleProgress/CircleProgress';
import { CustomGrid } from '../components/CustomGrid/CustomGrid';
import { EmptyPlaceholder } from '../components/EmptyPlaceholder/EmptyPlaceholder';
import { QuoteLine } from '../components/QuoteLine/QuoteLine';
import { quotes } from '../components/QuoteLine/quotes';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { fetchCampaigns } from './campaignsSlice';

/**
 * Component responsible for UI and logic of StartView (view shown after user logs in, in which
 * they can create new campaign or select/edit an existing one)
 * @returns
 */
export const StartView: React.FC = () => {
  const dispatch = useDispatch();
  const { isCampaignsListDownloaded: isCampaignListDownloaded, campaignsList } = useSelector(
    (state: RootState) => state.campaigns
  );
  useEffect(() => {
    if (!isCampaignListDownloaded) dispatch(fetchCampaigns());
  }, [dispatch, isCampaignListDownloaded]);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewCampaign);
    setIsOpen(true);
  };

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
        <EmptyPlaceholder message={'Go wild and start your new journey, worldshaper'} />
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
      handleFab={handleFab}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="start"
        sx={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <QuoteLine text={quote} />
        {renderCampaignsGrid()}
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
