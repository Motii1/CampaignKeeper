import { NavBarViewDialog } from '../../../../../../types/types';
import { EventDialog } from '../../../../../components/EventDialog/EventDialog';
import { SessionEventWithPos } from '../../../../../MapView/eventsSlice';

type AddChildDialogProps = {
  currentSessionId: string;
  currentEvent: SessionEventWithPos;
  parentId: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const AddChildDialog: React.FC<AddChildDialogProps> = props => (
  <EventDialog
    currentSessionId={props.currentSessionId}
    currentEvent={props.currentEvent}
    isOpen={props.isOpen}
    setIsOpen={props.setIsOpen}
    dialogType={NavBarViewDialog.NewEvent}
    setSnackbarSuccess={props.setSnackbarSuccess}
    setSnackbarError={props.setSnackbarError}
    isShownInExplorer
    parentId={props.parentId}
  />
);
