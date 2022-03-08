import { CampaignSecondaryDialog } from '../../../../CampaignView/secondaryDialog/CampaignSecondaryDialog';
import { StartSecondaryDialog } from '../../../../StartView/secondaryDialog/StartSecondaryDialog';
import viewsRoutes from '../../../../viewsRoutes';

type SecondaryDialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarInfo: (message: string) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const SecondaryDialogWrapper: React.FC<SecondaryDialogWrapperProps> = props => {
  switch (props.currentView) {
    case viewsRoutes.START:
      return (
        <StartSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.CAMPAIGN:
      return (
        <CampaignSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
        />
      );
    default:
      return (
        <StartSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
  }
};
