import { Box, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { handleWheelEvent, useWindowDimensions } from '../../utils/utils';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
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

  const { width: width } = useWindowDimensions();
  const centeredPadding = Math.max((width - 1368.1) / 2, width < 450 ? 6 : 51);

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
        sx={{ width: '100%', overflowY: 'auto' }}
      >
        <QuoteLine text={quote} />
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
            {campaignsList.length > 0 ? (
              campaignsList.map(campaign => (
                <Grid item key={campaign.name}>
                  <CampaignTile
                    campaignTitle={campaign.name}
                    setIsOpen={setIsOpen}
                    setDialogType={setDialogType}
                  />
                </Grid>
              ))
            ) : (
              // TO-DO: sx here needs rework to make component presentable
              <Typography
                variant="h2"
                sx={{
                  color: 'customPalette.accent',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingTop: 10,
                }}
              >
                {'Go wild and start your new journey'}
              </Typography>
            )}
          </Grid>
        </Box>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
