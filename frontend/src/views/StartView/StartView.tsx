import { Box, Grid, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StartViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { CampaignTile } from './components/CampaignTile/CampaignTile';
import { QuoteLine } from './components/QuoteLine/QuoteLine';
import { updateState } from './startViewSlice';

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
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const dispatch = useDispatch();
  const handleFab = () => {
    dispatch(updateState({ type: StartViewDialog.New }));
    setIsOpen(true);
  };

  const { width: width } = useWindowDimensions();
  const centeredPadding = Math.max((width - 1368.1) / 2, width < 450 ? 6 : 51);
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
    <ViewWithNavBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
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
        <QuoteLine text={exampleQuote} />
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
                <CampaignTile campaignTitle={title} setIsOpen={setIsOpen} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
