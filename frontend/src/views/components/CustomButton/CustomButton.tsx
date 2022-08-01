import { Button } from '@mui/material';
import { ReactElement } from 'react';
import { CustomButtonBehavior, CustomButtonType } from '../../../types/types';

type CustomButtonProps = {
  content: string | ReactElement;
  behavior?: CustomButtonBehavior;
  type?: CustomButtonType;
  onClick?: () => void;
};

/**
 * Standard MUI Button with custom styles and props allowing to specify its role (form button,
 * upload button, button that causes execution of function)
 * @param param0
 * @returns
 */
export const CustomButton: React.FC<CustomButtonProps> = ({
  behavior = CustomButtonBehavior.Submit,
  type = CustomButtonType.Accent,
  ...otherProps
}) => {
  let backgroundColor: string;
  let color: string;
  if (type === CustomButtonType.Accent) {
    backgroundColor = 'customPalette.accent';
    color = 'customPalette.onAccent';
  } else if (type === CustomButtonType.Primary) {
    backgroundColor = 'customPalette.background';
    color = 'customPalette.onBackground';
  } else if (type === CustomButtonType.Inverted) {
    backgroundColor = 'customPalette.onSurface';
    color = 'customPalette.surface';
  } else {
    backgroundColor = 'customPalette.red';
    color = 'customPalette.onRed';
  }

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
        <Button variant="contained" disableElevation component="span" sx={standardButtonSx}>
          {otherProps.content}
        </Button>
      );
    case CustomButtonBehavior.Func:
      return (
        <Button variant="contained" onClick={otherProps.onClick} sx={standardButtonSx}>
          {otherProps.content}
        </Button>
      );
    case CustomButtonBehavior.Submit:
      return (
        <Button variant="contained" type="submit" sx={standardButtonSx}>
          {otherProps.content}
        </Button>
      );
  }
};
