import { Paper, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { goToCampaign, goToLogout, goToNotes, goToStart } from '../../viewsSlice';
import { BigNavBarButton, Logo, LogoutPanel } from './elements';

// how to pass info which button should be chosen to NavBar?
// how to disable onClick in button when it is chosen?
export const NavBar: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper
      elevation={12}
      sx={{ backgroundColor: 'customBackgrounds.gray', height: 50, overflow: 'visible' }}
      square
    >
      <Stack direction="row" spacing={0} justifyContent="flex-start" alignItems="flex-start">
        <Logo />
        <BigNavBarButton
          text="START"
          isChosen={true}
          onClick={() => {
            dispatch(goToStart);
            history.push('/welcome');
          }}
        />
        <BigNavBarButton
          text="CAMPAIGN"
          isChosen={false}
          onClick={() => {
            dispatch(goToCampaign);
            history.push('/campaign');
          }}
        />
        <BigNavBarButton
          text="NOTES"
          isChosen={false}
          onClick={() => {
            dispatch(goToNotes);
            history.push('/notes');
          }}
        />
        <LogoutPanel
          onClick={() => {
            dispatch(goToLogout);
            history.push('/welcome');
          }}
        />
      </Stack>
    </Paper>
  );
};
