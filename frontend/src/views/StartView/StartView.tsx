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
        sx={{ overflowY: 'hidden' }}
      >
        <QuoteLine text={exampleQuote} />
        <Box
          component="div"
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            display: 'flex',
            height: '100%',
            width: '100%',
            maxWidth: 1400,
            overflowY: 'hidden',
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
              paddingLeft: 2,
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
