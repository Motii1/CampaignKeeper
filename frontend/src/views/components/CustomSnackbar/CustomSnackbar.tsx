import { Close } from '@mui/icons-material';
import { Portal, Snackbar } from '@mui/material';
import { CustomSnackbarType } from '../../../types/types';

export type CustomSnackbarProps = {
  message: string;
  type: CustomSnackbarType;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

/**
 * Standard MUI Snackbar rendered in Portal,
 * used for displaying all kinds of feedback to user actions,
 * e.g. information about success or fail of actions
 * which require comunication with server (create event, delete event, edit event etc.)
 * @param props
 * @returns
 */
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
