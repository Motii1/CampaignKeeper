import { Grid } from '@mui/material';

/**
 * Component used to display sets of components on grid
 * which size (number of elements in column) adjusts to screen resolution.
 * NOTE: when the grid overflows (there are more items than screen can fit),
 * the grid is scrollable horizontally
 * @param props
 * @returns
 */
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
