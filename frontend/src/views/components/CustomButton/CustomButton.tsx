import { Button } from '@mui/material';
import { CustomButtonType } from './CustomButtonTypes';

//TO-DO add type for color (gold/standard/red)
type CustomButtonProps = {
  text: string;
  type?: CustomButtonType;
  onClick?: () => void;
};

//TO-DO add setting color and background color in standardButtonSx
export const CustomButton: React.FC<CustomButtonProps> = ({
  type = CustomButtonType.Submit,
  ...otherProps
}) => {
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
  switch (type) {
    case CustomButtonType.Upload:
      return (
        <Button variant="contained" component="span" sx={standardButtonSx}>
          <b>{otherProps.text}</b>
        </Button>
      );
    case CustomButtonType.Func:
      return (
        <Button variant="contained" onClick={otherProps.onClick} sx={standardButtonSx}>
          <b>{otherProps.text}</b>
        </Button>
      );
    case CustomButtonType.Submit:
      return (
        <Button variant="contained" type="submit" sx={standardButtonSx}>
          <b>{otherProps.text}</b>
        </Button>
      );
  }
};
