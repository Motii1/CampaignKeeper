import { NavBarViewDialog } from '../../../../../types/types';
import { StartDialog } from '../../../../StartView/dialog/StartDialog';
import viewsRoutes from '../../../../viewsRoutes';

type DialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  dialogType: NavBarViewDialog;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void;
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
        />
      );
    default:
      return (
        <StartDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
        />
      );
  }
};
