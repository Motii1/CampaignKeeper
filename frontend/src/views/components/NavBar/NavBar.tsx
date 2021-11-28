import { Paper, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { View } from '../../../enums/View';
import { RootState } from '../../../store';
import { goToView } from '../../viewsSlice';
import { Logo, LogoutPanel, PrimaryNavBarButton, SecondaryNavBarButton } from './elements';

export const NavBar: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentView = useSelector((state: RootState) => state.views.value);
  // eslint-disable-next-line no-console
  console.log(currentView);
  const areSecondaryButtonsDisplayed =
    currentView === View.Campaign ||
    currentView === View.Map ||
    currentView === View.Sessions ||
    currentView === View.Codex;

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
          isChosen={currentView === View.Start}
          onClick={() => {
            dispatch(goToView(View.Start));
            history.push('/welcome');
          }}
        />
        <PrimaryNavBarButton
          text="CAMPAIGN"
          isChosen={areSecondaryButtonsDisplayed}
          onClick={() => {
            dispatch(goToView(View.Campaign));
            history.push('/campaign');
          }}
        />
        <SecondaryNavBarButton
          text="MAP"
          isChosen={currentView === View.Map}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            dispatch(goToView(View.Map));
            history.push('/map');
          }}
        />
        <SecondaryNavBarButton
          text="SESSIONS"
          isChosen={currentView === View.Sessions}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            dispatch(goToView(View.Sessions));
            history.push('/sessions');
          }}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={currentView === View.Codex}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            dispatch(goToView(View.Codex));
            history.push('/codex');
          }}
        />
        <PrimaryNavBarButton
          text="NOTES"
          isChosen={currentView === View.Notes}
          onClick={() => {
            dispatch(goToView(View.Notes));
            history.push('/notes');
          }}
        />
        <LogoutPanel
          onClick={() => {
            dispatch(goToView(View.Logout));
            history.push('/welcome');
          }}
        />
      </Stack>
    </Paper>
  );
};
