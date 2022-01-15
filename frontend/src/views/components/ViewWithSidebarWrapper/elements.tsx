import { Container, Grid, Paper } from '@mui/material';
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
    <Container sx={{ width: '72%' }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: '20px',
          marginTop: '75px',
          backgroundColor: 'customPalette.surface',
          paddingBottom: '10px',
        }}
      >
        <Container
          onClick={() => {
            history.push(viewsRoutes.LANDING);
          }}
          sx={{
            cursor: 'pointer',
            backgroundImage: `url(${Logo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            position: 'relative',
            top: '-75px',
            height: '150px',
            marginBottom: '-75px',
          }}
        />
        <Container sx={{ height: 10 }} />
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
