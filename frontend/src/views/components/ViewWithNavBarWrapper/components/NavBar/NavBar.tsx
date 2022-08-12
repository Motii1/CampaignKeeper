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

/**
 * Component serving as navigation bar displayed on top of the screen,
 * used to navigate between views in application, display info about currently
 * logged user and menu in which they can change their data, display information
 * about application and log out.
 * It has two sets of buttons, primary (Start, Campaign and Notes) which is always displayed
 * and secondary (Map, Explorer, Codex) which is displayed only if user is CampaignView
 * or one of its subviews (MapView, ExplorerView, CodexView). *
 * @param props
 * @returns
 */
export const NavBar: React.FC<NavBarProps> = props => {
  const history = useHistory();

  const sessionIdMapView = useSelector((state: RootState) => state.mapView.currentSessionId);
  const sessionIdExplorerView = useSelector(
    (state: RootState) => state.explorerView.currentSessionId
  );

  const areSecondaryButtonsDisplayed = secondaryButtonDisplayableViews.includes(props.currentView);

  const moveToSessionView = (name: string, sessionId: string, viewRoute: string) => {
    if (sessionId !== '') history.push(viewRoute);
    else props.setSnackbarError(`You can't open ${name} without selecting session`);
  };

  // eslint-disable-next-line no-console
  console.log(props.currentView);

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
          onClick={() => moveToSessionView('Map', sessionIdMapView, viewsRoutes.MAP)}
        />
        <SecondaryNavBarButton
          text="EXPLORER"
          isChosen={props.currentView === viewsRoutes.EXPLORER}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => moveToSessionView('Explorer', sessionIdExplorerView, viewsRoutes.EXPLORER)}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={props.currentView === viewsRoutes.CODEX}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => history.push(viewsRoutes.CODEX)}
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
