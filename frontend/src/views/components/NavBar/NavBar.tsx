import { Paper, Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import protectedApiClient from '../../../axios/axios';
import { RootState } from '../../../store';
import { AUTH_URL } from '../../LandingView/forms/RegisterForm';
import viewsRoutes from '../../viewsRoutes';
import { Logo, LogoutPanel, PrimaryNavBarButton, SecondaryNavBarButton } from './elements';

const logout = (): Promise<AxiosResponse> => protectedApiClient.post(`${AUTH_URL}/logout`, {});

export const NavBar: React.FC = () => {
  const history = useHistory();
  const username = useSelector((state: RootState) => state.userDetailsReducer.username);
  const currentView = useLocation().pathname;
  const areSecondaryButtonsDisplayed =
    currentView === viewsRoutes.CAMPAIGN ||
    currentView === viewsRoutes.MAP ||
    currentView === viewsRoutes.SESSIONS ||
    currentView === viewsRoutes.CODEX;

  const handleLogoutButton = async () => {
    const response = await logout();
    if (response.status === 200) history.push(viewsRoutes.LANDING);
    else history.push(viewsRoutes.ERROR);
  };

  return (
    <Paper
      elevation={6}
      sx={{ backgroundColor: 'customBackgrounds.gray', height: 50, overflow: 'visible' }}
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
        <LogoutPanel username={username} onClick={handleLogoutButton} />
      </Stack>
    </Paper>
  );
};
