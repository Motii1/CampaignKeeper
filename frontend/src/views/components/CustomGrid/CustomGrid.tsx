import { Grid } from '@mui/material';

export const CustomGrid: React.FC = props => (
  <Grid
    container
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
    columnSpacing={5}
    sx={{
      maxHeight: '100%',
      width: { xs: 413, md: 750, lg: 975, xl: 1442 },
      paddingLeft: 5.5,
    }}
  >
    {props.children}
  </Grid>
);
