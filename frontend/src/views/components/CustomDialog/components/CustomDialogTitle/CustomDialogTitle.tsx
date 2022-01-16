import { Typography } from '@mui/material';

type CustomDialogTitleProps = {
  title: string;
};

export const CustomDialogTitle: React.FC<CustomDialogTitleProps> = props => (
  <Typography
    variant="h4"
    sx={{
      color: 'customPalette.accent',
      fontWeight: 'bold',
      letterSpacing: 0.5,
      paddingTop: 1,
    }}
  >
    {props.title}
  </Typography>
);
