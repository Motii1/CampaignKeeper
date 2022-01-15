import { Paper, Stack } from '@mui/material';
import { useHistory, useLocation } from 'react-router';
import viewsRoutes from '../../viewsRoutes';
import { Logo, PrimaryNavBarButton, SecondaryNavBarButton, UserPanel } from './elements';

export const NavBar: React.FC = () => {
  const history = useHistory();
  //const dispatch = useDispatch();
  const currentView = useLocation().pathname;

  const secondaryButtonDisplayableViews = [
    viewsRoutes.CAMPAIGN,
    viewsRoutes.MAP,
    viewsRoutes.SESSIONS,
    viewsRoutes.CODEX,
  ];
  const areSecondaryButtonsDisplayed = secondaryButtonDisplayableViews.includes(currentView);

  /*
  const handleLogoutButton = async () => {
    const response = await logout(dispatch);
    if (response.status === 200) history.push(viewsRoutes.LANDING);
    else history.push(viewsRoutes.ERROR);
  };
  */
  return (
    <Paper
      elevation={6}
      sx={{ backgroundColor: 'customPalette.surface', height: 50, overflow: 'visible' }}
      square
    >
      <Stack direction="row" spacing={0} justifyContent="flex-start" alignItems="flex-start">
        <Logo />
        <PrimaryNavBarButton
          text="START"
          isChosen={currentView === viewsRoutes.START}
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
          isChosen={currentView === viewsRoutes.MAP}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.MAP);
          }}
        />
        <SecondaryNavBarButton
          text="SESSIONS"
          isChosen={currentView === viewsRoutes.SESSIONS}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.SESSIONS);
          }}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={currentView === viewsRoutes.CODEX}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.CODEX);
          }}
        />
        <PrimaryNavBarButton
          text="NOTES"
          isChosen={currentView === viewsRoutes.NOTES}
          onClick={() => {
            history.push(viewsRoutes.NOTES);
          }}
        />
        <UserPanel />
      </Stack>
    </Paper>
  );
};
