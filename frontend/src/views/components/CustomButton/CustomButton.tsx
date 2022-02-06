import { Button } from '@mui/material';
import { CustomButtonBehavior, CustomButtonType } from '../../../types/types';

//TO-DO add type for color (gold/standard/red)
type CustomButtonProps = {
  text: string;
  behavior?: CustomButtonBehavior;
  type?: CustomButtonType;
  onClick?: () => void;
};

//TO-DO add setting color and background color in standardButtonSx
export const CustomButton: React.FC<CustomButtonProps> = ({
  behavior = CustomButtonBehavior.Submit,
  type = CustomButtonType.Accent,
  ...otherProps
}) => {
  const backgroundColor =
    type === CustomButtonType.Accent ? 'customPalette.accent' : 'customPalette.primary';
  const color =
    type === CustomButtonType.Accent ? 'customPalette.onAccent' : 'customPalette.onPrimary';

  const standardButtonSx = {
    color: color,
    paddingLeft: 1.2,
    paddingRight: 1.2,
    paddingTop: 0.5,
    paddingBottom: 0.3,
    fontWeight: 'bold',
    backgroundColor: backgroundColor,
    '&.MuiButtonBase-root:hover': {
      bgcolor: backgroundColor,
    },
  };
  switch (behavior) {
    case CustomButtonBehavior.Upload:
      return (
        <Button variant="contained" component="span" sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
    case CustomButtonBehavior.Func:
      return (
        <Button variant="contained" onClick={otherProps.onClick} sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
    case CustomButtonBehavior.Submit:
      return (
        <Button variant="contained" type="submit" sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
  }
};
