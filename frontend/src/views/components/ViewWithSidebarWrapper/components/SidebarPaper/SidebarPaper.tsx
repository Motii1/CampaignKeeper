import { Container, Paper } from '@mui/material';
import { SidebarLogo } from './components/SidebarLogo/SidebarLogo';

export const SidebarPaper: React.FC = ({ children }) => (
  <Container sx={{ width: 360, marginTop: -1 }}>
    <Paper
      elevation={6}
      sx={{
        borderRadius: '20px',
        marginTop: '75px',
        backgroundColor: 'customPalette.surface',
        paddingBottom: '10px',
      }}
    >
      <SidebarLogo />
      <Container sx={{ height: 15 }} />
      {children}
    </Paper>
  </Container>
);
