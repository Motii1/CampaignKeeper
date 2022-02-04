import { StartCustomDialog } from '../../../../StartView/dialog/StartCustomDialog';
import viewsRoutes from '../../../../viewsRoutes';

type CustomDialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const CustomDialogWrapper: React.FC<CustomDialogWrapperProps> = props => {
  switch (props.currentView) {
    case viewsRoutes.START:
      return <StartCustomDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} />;
    default:
      return <StartCustomDialog isOpen={props.isOpen} setIsOpen={props.setIsOpen} />;
  }
};
