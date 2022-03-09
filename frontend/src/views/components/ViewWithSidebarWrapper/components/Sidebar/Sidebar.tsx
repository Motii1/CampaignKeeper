import { Grid } from '@mui/material';

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
    {children}
  </Grid>
);
