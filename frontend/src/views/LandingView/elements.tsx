import { Container, Grid, Paper } from '@mui/material';
import OwlImage from '../../graphics/giantOwl.jpg';
import Logo from '../../graphics/logo.svg';

export const LandingGrid: React.FC = ({ children }) => (
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
      backgroundColor: 'background.default',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
  </Grid>
);

export const FormPaper: React.FC = ({ children }) => (
  <Container sx={{ width: '80%' }}>
    <Paper
      elevation={6}
      sx={{
        borderRadius: '20px',
        backgroundColor: 'customBackgrounds.gray',
        paddingBottom: '10px',
      }}
    >
      <Container
        sx={{
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
      {children}
    </Paper>
  </Container>
);

export const LandingGraphic: React.FC = () => (
  <Grid
    item
    lg={8}
    md={6}
    sm={3}
    xs={false}
    sx={{
      backgroundImage: `url(${OwlImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
    }}
  />
);
