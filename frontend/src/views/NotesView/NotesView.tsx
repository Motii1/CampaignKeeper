import { Paper, Stack } from '@mui/material';
import { NavBar } from '../components/NavBar/NavBar';

export const NotesView: React.FC = () => (
  <Stack>
    <NavBar />
    <Paper
      elevation={0}
      sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}
      square
    />
  </Stack>
);
