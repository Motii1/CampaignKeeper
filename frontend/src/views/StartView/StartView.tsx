import { Box, Grid, Stack } from '@mui/material';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { CampaignTile } from './components/CampaignTile/CampaignTile';
import { QuoteLine } from './components/QuoteLine/QuoteLine';

export const StartView: React.FC = () => {
  const exampleQuote = '"On the Honor of the Greyskull!" ~ She-Ra';
  const exampleTitles = [
    'Rime of the Frostmaiden',
    'Descent into Avernus',
    'Curse of Strahd',
    'Tomb of Anihilation',
    'Dragon of Icespire Peak',
    'Rise of Tiamat',
    `Storm Lord's Wrath`,
    `Sleeping Dragon's Wake`,
    'Divine Contention',
  ];

  return (
    <ViewWithNavBarWrapper>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', overflowY: 'auto' }}
      >
        <QuoteLine text={exampleQuote} />
        {/* This Box should be a whole component that calculates on every resize
            left padding of the grid so the grid is always properly centered */}
        <Box
          component="div"
          sx={{
            overflowY: 'auto',
            alignItems: 'center',
            justifyContent: 'flex-start',
            display: 'flex',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
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
              paddingLeft: '14.3%',
            }}
          >
            {exampleTitles.map(title => (
              <Grid item key={title}>
                <CampaignTile campaignTitle={title} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
