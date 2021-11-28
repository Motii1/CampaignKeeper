import { Paper, Stack } from '@mui/material';
import { useHistory } from 'react-router';
import { BigNavBarButton, Logo, LogoutPanel } from './elements';

// how to pass info which button should be chosen to NavBar?
// how to disable onClick in button when it is chosen?
export const NavBar: React.FC = () => {
  const history = useHistory();
  return (
    <Paper sx={{ backgroundColor: 'customBackgrounds.lightGray', height: 50 }} square>
      <Stack direction="row" spacing={0} justifyContent="flex-start" alignItems="flex-start">
        <Logo />
        <BigNavBarButton text="START" isChosen={true} onClick={() => history.push('/welcome')} />
        <BigNavBarButton
          text="CAMPAIGN"
          isChosen={false}
          onClick={() => history.push('/campaign')}
        />
        <BigNavBarButton text="NOTES" isChosen={false} onClick={() => history.push('/notes')} />
        <LogoutPanel onClick={() => history.push('/welcome')} />
      </Stack>
    </Paper>
  );
};
