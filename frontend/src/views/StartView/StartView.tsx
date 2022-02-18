import { Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { CampaignTile } from './components/CampaignTile/CampaignTile';
import { QuoteLine } from './components/QuoteLine/QuoteLine';
import { quotes } from './components/QuoteLine/quotes';

//TO-DO: lift this method up as it will be used in another views
const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

//TO-DO: as above
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

//TO-DO: as above
const handleWheelEvent = (e: React.WheelEvent) => {
  if (e.deltaY !== 0) {
    e.currentTarget.scrollTo({
      top: 0,
      left: e.currentTarget.scrollLeft + e.deltaY,
    });
  }
};

export const StartView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.New);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.New);
    setIsOpen(true);
  };

  const { width: width } = useWindowDimensions();
  const centeredPadding = Math.max((width - 1368.1) / 2, width < 450 ? 6 : 51);
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
    'Hoard of the Dragon Queen',
  ];

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
            {exampleTitles.map(title => (
              <Grid item key={title}>
                <CampaignTile
                  campaignTitle={title}
                  setIsOpen={setIsOpen}
                  setDialogType={setDialogType}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
