import { Typography } from '@mui/material';

type CustomDialogTitleProps = {
  title: string;
  isTitleRed?: boolean;
};

export const CustomDialogTitle: React.FC<CustomDialogTitleProps> = props => {
  const sx = {
    color: props.isTitleRed ? 'customPalette.red' : 'customPalette.onBackgroundSpecial',
    fontWeight: 'medium',
    letterSpacing: 0.5,
    paddingTop: 0.6,
    paddingBottom: 1,
    paddingLeft: 2.4,
    paddingRight: 2.4,
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
