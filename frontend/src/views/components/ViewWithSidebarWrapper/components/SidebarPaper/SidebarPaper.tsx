import { Box, Container, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Logo from '../../../../../graphics/logo.svg';
import viewsRoutes from '../../../../viewsRoutes';

export const SidebarPaper: React.FC = ({ children }) => {
  const history = useHistory();
  return (
    <Container sx={{ width: 380 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: '20px',
          marginTop: '75px',
          backgroundColor: 'customPalette.surface',
          paddingBottom: '10px',
        }}
      >
        <Box
          component="img"
          onClick={() => {
            history.push(viewsRoutes.LANDING);
          }}
          sx={{
            height: 120,
            marginTop: -8,
            width: '100%',
          }}
          alt="Logo"
          src={Logo}
        />
        <Container sx={{ height: 15 }} />
        {children}
      </Paper>
    </Container>
  );
};
