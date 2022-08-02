import { NavBarViewDialog } from '../../../../../types/types';
import { CampaignDialog } from '../../../../CampaignView/dialog/CampaignDialog';
import { CodexDialog } from '../../../../CodexView/dialog/CodexDialog';
import { ExplorerDialog } from '../../../../ExplorerView/dialog/ExplorerDialog';
import { MapDialog } from '../../../../MapView/dialog/MapDialog';
import { StartDialog } from '../../../../StartView/dialog/StartDialog';
import viewsRoutes from '../../../../viewsRoutes';

type PrimaryCustomDialogWrapperProps = {
  currentView: string;
  isOpen: boolean;
  dialogType: NavBarViewDialog;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void; // TO-DO: remove question mark?
  setSnackbarInfo: (message: string) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Wrapper on primary dialog (forms creating/editing objects e.g. campaigns),
 * returns adequate dialog based on current view (path)
 * @param props
 * @returns
 */
export const PrimaryCustomDialogWrapper: React.FC<PrimaryCustomDialogWrapperProps> = props => {
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
      return (
        <CampaignDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.CODEX:
      return (
        <CodexDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.MAP:
      return (
        <MapDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          dialogType={props.dialogType}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
    case viewsRoutes.EXPLORER:
      return (
        <ExplorerDialog
          isOpen={props.isOpen}
          setIsOpen={props.setIsOpen}
          setIsSecondaryOpen={props.setIsSecondaryOpen as (newIsOpen: boolean) => void}
          setSnackbarSuccess={props.setSnackbarSuccess}
          setSnackbarError={props.setSnackbarError}
        />
      );
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
