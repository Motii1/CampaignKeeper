import { Button } from '@mui/material';

type StandardButtonProps = {
  text: string;
  isUsedForUpload?: boolean;
};

export const StandardButton: React.FC<StandardButtonProps> = props => {
  const standardButtonSx = {
    color: 'customPalette.onAccent',
    paddingLeft: 1.2,
    paddingRight: 1.2,
    paddingTop: 0.5,
    paddingBottom: 0.3,
    fontWeight: 'bold',
    backgroundColor: 'customPalette.accent',
    '&.MuiButtonBase-root:hover': {
      bgcolor: 'customPalette.accent',
    },
  };
  if (props.isUsedForUpload)
    return (
      <Button variant="contained" component="span" sx={standardButtonSx}>
        <b>{props.text}</b>
      </Button>
    );
  return (
    <Button variant="contained" type="submit" sx={standardButtonSx}>
      <b>{props.text}</b>
    </Button>
  );
};

StandardButton.defaultProps = {
  isUsedForUpload: false,
} as Partial<StandardButtonProps>;
