import { SecondaryEventDialogType } from '../../../types/types';
import { EventSecondaryDialog } from '../../components/EventSecondaryDialog/EventSecondaryDialog';

type MapSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const MapSecondaryDialog: React.FC<MapSecondaryDialogProps> = props => (
  <EventSecondaryDialog
    type={SecondaryEventDialogType.Map}
    isOpen={props.isOpen}
    setIsOpen={props.setIsOpen}
    setIsPrimaryOpen={props.setIsPrimaryOpen}
    setSnackbarSuccess={props.setSnackbarSuccess}
    setSnackbarError={props.setSnackbarError}
  />
);
