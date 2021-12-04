import { Paper, Stack } from '@mui/material';
import { NavBar } from '../NavBar/NavBar';

export const ViewWithNavBarWrapper: React.FC = props => (
  <Stack>
    <NavBar />
    <Paper elevation={0} sx={{ backgroundColor: 'background.default', minHeight: '100vh' }} square>
      {props.children}
    </Paper>
  </Stack>
);
