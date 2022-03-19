import { Grid } from '@mui/material';

type CustomGridProps = {
  centeredPadding: number;
};

export const CustomGrid: React.FC<CustomGridProps> = props => (
  <Grid
    container
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    columnSpacing={10}
    sx={{
      maxHeight: '100%',
      width: 'auto',
      maxWidth: '100%',
      paddingLeft: props.centeredPadding + 'px',
    }}
  >
    {props.children}
  </Grid>
);
