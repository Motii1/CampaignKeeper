import { Container, Grid, Paper } from '@mui/material';
import OwlImage from './graphics/giantOwl.jpg';
import Logo from './graphics/logo.png';

export const LandingGrid: React.FC = ({ children }) => (
  <Grid container sx={{ minHeight: '100vh' }}>
    {children}
  </Grid>
);

export const Sidebar: React.FC = ({ children }) => (
  <Grid
    item
    lg={3}
    md={6}
    sm={9}
    xs={12}
    sx={{
      backgroundColor: '#262E38',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </Grid>
);

export const FormPaper: React.FC = ({ children }) => (
  <Container sx={{ width: '80%' }}>
    <Container
      sx={{
        backgroundImage: `url(${Logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: '80%',
        height: '100px',
        zIndex: '1',
      }}
    />
    <Paper
      elevation={6}
      sx={{
        backgroundColor: '#2B3D49',
      }}
    >
      {children}
    </Paper>
  </Container>
);

export const LandingGraphic: React.FC = () => (
  <Grid
    item
    lg={9}
    md={6}
    sm={3}
    xs={false}
    sx={{
      backgroundImage: `url(${OwlImage})`,
    }}
  />
);
