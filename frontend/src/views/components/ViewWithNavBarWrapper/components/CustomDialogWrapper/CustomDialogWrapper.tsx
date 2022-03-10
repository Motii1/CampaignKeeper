import { NavBarViewDialog } from '../../../../../types/types';
import { StartDialog } from '../../../../StartView/dialog/StartDialog';
import viewsRoutes from '../../../../viewsRoutes';

type DialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  dialogType: NavBarViewDialog;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void; // TO-DO: remove question mark?
  setSnackbarInfo: (message: string) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const DialogWrapper: React.FC<DialogWrapperProps> = props => {
  switch (props.currentView) {
    case viewsRoutes.START:
      return (
        <StartDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.CAMPAIGN:
      // TO-DO: add opening of the campaign dialog
      return null;
    default:
      return (
        <StartDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
  }
};
