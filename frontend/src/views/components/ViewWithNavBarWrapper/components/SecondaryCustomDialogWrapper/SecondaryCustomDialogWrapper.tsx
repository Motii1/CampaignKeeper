import { CampaignSecondaryDialog } from '../../../../CampaignView/secondaryDialog/CampaignSecondaryDialog';
import { StartSecondaryDialog } from '../../../../StartView/secondaryDialog/StartSecondaryDialog';
import viewsRoutes from '../../../../viewsRoutes';

type SecondaryDialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
};

export const SecondaryDialogWrapper: React.FC<SecondaryDialogWrapperProps> = props => {
  switch (props.currentView) {
    case viewsRoutes.START:
      return (
        <StartSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
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
        />
      );
  }
};
