import { Paper, Stack } from '@mui/material';
import { useHistory } from 'react-router';
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

export const NavBar: React.FC<NavBarProps> = props => {
  const history = useHistory();

  const secondaryButtonDisplayableViews = [
    viewsRoutes.CAMPAIGN,
    viewsRoutes.MAP,
    viewsRoutes.SESSIONS,
    viewsRoutes.CODEX,
  ];
  const areSecondaryButtonsDisplayed = secondaryButtonDisplayableViews.includes(props.currentView);

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
          onClick={() => {
            history.push(viewsRoutes.MAP);
          }}
        />
        <SecondaryNavBarButton
          text="EXPLORER"
          isChosen={props.currentView === viewsRoutes.SESSIONS}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.SESSIONS);
          }}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={props.currentView === viewsRoutes.CODEX}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.CODEX);
          }}
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
