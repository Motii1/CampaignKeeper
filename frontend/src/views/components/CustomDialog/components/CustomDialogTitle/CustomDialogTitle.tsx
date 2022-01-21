import { Typography } from '@mui/material';

type CustomDialogTitleProps = {
  title: string;
  isTitleRed?: boolean;
};

export const CustomDialogTitle: React.FC<CustomDialogTitleProps> = props => {
  const sx = {
    color: props.isTitleRed ? 'customPalette.onError' : 'customPalette.accent',
    fontWeight: 'medium',
    letterSpacing: 0.5,
    paddingTop: 0.6,
    paddingBottom: 1,
  };
  return (
    <Typography variant="h4" sx={sx}>
      {props.title}
    </Typography>
  );
};

CustomDialogTitle.defaultProps = {
  isTitleRed: false,
} as Partial<CustomDialogTitleProps>;
