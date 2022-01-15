import { Paper, Stack } from '@mui/material';
import { NavBar } from '../NavBar/NavBar';

export const ViewWithNavBarWrapper: React.FC = props => (
  <Paper
    square
    sx={{
      height: '100vh',
      width: '100%',
      backgroundColor: 'customPalette.background',
    }}
  >
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={0}
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <NavBar />
      {props.children}
    </Stack>
  </Paper>
);
