import { Close } from '@mui/icons-material';
import { Portal, Snackbar } from '@mui/material';
import { CustomSnackbarType } from '../../../types/types';

export type CustomSnackbarProps = {
  message: string;
  type: CustomSnackbarType;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const CustomSnackbar: React.FC<CustomSnackbarProps> = props => (
  <Portal>
    <Snackbar
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      message={props.message}
      action={<Close onClick={() => props.setIsOpen(false)} />}
      autoHideDuration={3000}
      sx={{
        '& .MuiSnackbarContent-root': {
          backgroundColor:
            props.type === CustomSnackbarType.Success
              ? 'customPalette.accent'
              : props.type === CustomSnackbarType.Error
              ? 'customPalette.error'
              : 'customPalette.surface',
          color:
            props.type === CustomSnackbarType.Success
              ? 'customPalette.onAccent'
              : props.type === CustomSnackbarType.Error
              ? 'customPalette.onError'
              : 'customPalette.onSurface',
          fontWeight: 'medium',
        },
      }}
    />
  </Portal>
);
