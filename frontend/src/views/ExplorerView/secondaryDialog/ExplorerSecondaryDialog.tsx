import { SecondaryEventDialogType } from '../../../types/types';
import { EventSecondaryDialog } from '../../components/EventSecondaryDialog/EventSecondaryDialog';

type ExplorerSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const ExplorerSecondaryDialog: React.FC<ExplorerSecondaryDialogProps> = props => (
  <EventSecondaryDialog
    type={SecondaryEventDialogType.Explorer}
    isOpen={props.isOpen}
    setIsOpen={props.setIsOpen}
    setIsPrimaryOpen={props.setIsPrimaryOpen}
    setSnackbarSuccess={props.setSnackbarSuccess}
    setSnackbarError={props.setSnackbarError}
  />
);
