import { Container, Grid, Paper } from '@mui/material';
import { SidebarLogo } from './components/SidebarLogo/SidebarLogo';

/**
 * Sidebar for ViewWithSidebarWrapper, most important component of its views
 * in which all relevant information/components are contained
 * @param param0
 * @returns
 */
export const Sidebar: React.FC = ({ children }) => (
  <Grid
    item
    lg={3}
    md={4}
    sm={6}
    xs={12}
    sx={{
      backgroundColor: 'customPalette.background',
      display: 'flex',
      alignItems: 'center',
      minWidth: 400,
      paddingBottom: 2,
    }}
  >
    <Container sx={{ width: 360, marginTop: -1 }}>
      <Paper
        elevation={0}
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
  </Grid>
);
