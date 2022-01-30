import { Grid, Stack } from '@mui/material';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { CampaignTile } from './components/CampaignTitle/CampaignTile';
import { QuoteLine } from './components/QuoteLine/QuoteLine';

export const WelcomeView: React.FC = () => {
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
    'Divine Contention ',
  ];

  return (
    <ViewWithNavBarWrapper>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0}
        sx={{ margin: 'auto' }}
      >
        <QuoteLine text={exampleQuote} />
        <Grid container rowSpacing={3} columnSpacing={4} sx={{ width: '80vw', margin: '0' }}>
          {exampleTitles.map(title => (
            <Grid container item xs={4} key={title}>
              <CampaignTile campaignTitle={title} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
