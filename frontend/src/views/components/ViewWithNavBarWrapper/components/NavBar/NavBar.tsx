import { Paper, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../../../../store';
import viewsRoutes from '../../../../viewsRoutes';
import { NavBarLogo } from './components/NavBarLogo/NavBarLogo';
import { PrimaryNavBarButton } from './components/PrimaryNavBarButton/PrimaryNavBarButton';
import { SecondaryNavBarButton } from './components/SecondaryNavBarButton/SecondaryNavBarButton';
import { UserPanel } from './components/UserPanel/UserPanel';

type NavBarProps = {
  currentView: string;
  setSnackbarInfo: (message: string) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

const secondaryButtonDisplayableViews = [
  viewsRoutes.CAMPAIGN,
  viewsRoutes.MAP,
  viewsRoutes.EXPLORER,
  viewsRoutes.CODEX,
];

export const NavBar: React.FC<NavBarProps> = props => {
  const history = useHistory();

  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);

  const areSecondaryButtonsDisplayed = secondaryButtonDisplayableViews.includes(props.currentView);

  const moveToSecondaryView = (name: string, viewRoute: string) => {
    if (currentCampaignId !== '') history.push(viewRoute);
    else props.setSnackbarError(`You can't open ${name} without selecting campaign`);
  };

  return (
    <Paper elevation={0} square sx={{ backgroundColor: 'customPalette.surface', height: 50 }}>
      <Stack
        direction="row"
        spacing={0}
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{ overflowX: 'hidden' }}
      >
        <NavBarLogo />
        <PrimaryNavBarButton
          text="START"
          isChosen={props.currentView === viewsRoutes.START}
          onClick={() => {
            history.push(viewsRoutes.START);
          }}
        />
        <PrimaryNavBarButton
          text="CAMPAIGN"
          isChosen={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.CAMPAIGN);
          }}
        />
        <SecondaryNavBarButton
          text="MAP"
          isChosen={props.currentView === viewsRoutes.MAP}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => moveToSecondaryView('Map', viewsRoutes.MAP)}
        />
        <SecondaryNavBarButton
          text="EXPLORER"
          isChosen={props.currentView === viewsRoutes.EXPLORER}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => moveToSecondaryView('Explorer', viewsRoutes.EXPLORER)}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={props.currentView === viewsRoutes.CODEX}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => moveToSecondaryView('Codex', viewsRoutes.CODEX)}
        />
        <PrimaryNavBarButton
          text="NOTES"
          isChosen={props.currentView === viewsRoutes.NOTES}
          onClick={() => {
            history.push(viewsRoutes.NOTES);
          }}
        />
        <UserPanel
          setSnackbarInfo={props.setSnackbarInfo}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      </Stack>
    </Paper>
  );
};
