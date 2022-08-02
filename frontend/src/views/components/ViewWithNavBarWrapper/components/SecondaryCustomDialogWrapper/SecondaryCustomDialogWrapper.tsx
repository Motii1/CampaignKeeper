import { CampaignSecondaryDialog } from '../../../../CampaignView/secondaryDialog/CampaignSecondaryDialog';
import { CodexSecondaryDialog } from '../../../../CodexView/secondaryDialog/CodexSecondaryDialog';
import { ExplorerSecondaryDialog } from '../../../../ExplorerView/secondaryDialog/ExplorerSecondaryDialog';
import { MapSecondaryDialog } from '../../../../MapView/secondaryDialog/MapSecondaryDialog';
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

/**
 * Wrapper on secondary dialog (confirmation of e.g. session deletion),
 * returns adequate dialog based on current view (path)
 * @param props
 * @returns
 */
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
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.CODEX:
      return (
        <CodexSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.MAP:
      return (
        <MapSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.EXPLORER:
      return (
        <ExplorerSecondaryDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
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
