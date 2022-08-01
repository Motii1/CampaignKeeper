import { SecondaryEventDialogType } from '../../../types/types';
import { EventSecondaryDialog } from '../../components/EventSecondaryDialog/EventSecondaryDialog';

type MapSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Component used as secondary dialog in Map to ask user
 * for confirmation that they want to delete selected event.
 * NOTE1: deleting event with children requires pointing new parent event.
 * NOTE2: during to similiarites in UI and function
 * between secondary dialog in MapView and ExplorerView,
 * this component is actually wrapper for uniform EventSecondaryDialog
 * @param props
 * @returns
 */
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
