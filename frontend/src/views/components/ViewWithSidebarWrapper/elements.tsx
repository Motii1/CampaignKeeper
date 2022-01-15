import { Box, Container, Grid, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Logo from '../../../graphics/logo.svg';
import WorldImage from '../../../graphics/world.jpg';
import viewsRoutes from '../../viewsRoutes';

export const SidebarViewGrid: React.FC = ({ children }) => (
  <Grid container sx={{ minHeight: '100vh' }}>
    {children}
  </Grid>
);

export const Sidebar: React.FC = ({ children }) => (
  <Grid
    item
    lg={4}
    md={6}
    sm={9}
    xs={12}
    sx={{
      backgroundColor: 'customPalette.background',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
  </Grid>
);

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

export const BackgroundGraphic: React.FC = () => (
  <Grid
    item
    lg={8}
    md={6}
    sm={3}
    xs={false}
    sx={{
      backgroundImage: `url(${WorldImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
);
