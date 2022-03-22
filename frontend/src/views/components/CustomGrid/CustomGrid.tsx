import { Grid } from '@mui/material';

export const CustomGrid: React.FC = props => (
  <Grid
    container
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
    columnSpacing={2.0}
    sx={{
      maxHeight: '100%',
      width: { xs: 380, md: 720, lg: 900, xl: 1352 },
      paddingLeft: 4.3,
    }}
  >
    {props.children}
  </Grid>
);
