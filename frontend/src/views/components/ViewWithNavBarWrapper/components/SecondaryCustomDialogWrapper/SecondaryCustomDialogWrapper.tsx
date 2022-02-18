import { StartSecondaryDialog } from '../../../../StartView/secondaryDialog/StartSecondaryDialog';
import viewsRoutes from '../../../../viewsRoutes';

type SecondaryDialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const SecondaryDialogWrapper: React.FC<SecondaryDialogWrapperProps> = props => {
  switch (props.currentView) {
    case viewsRoutes.START:
      return <StartSecondaryDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} />;
    default:
      return <StartSecondaryDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} />;
  }
};
