import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { EventDialog } from '../../components/EventDialog/EventDialog';

type ExplorerDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Component serving as main dialog in ExplorerView,
 * used for editing currently selected event.
 * Can be opened by FAB.
 * NOTE: during to similiarites in UI and function
 * between primary dialog in ExplorerView and MapView,
 * this component is actually wrapper for uniform EventDialog
 * @param props
 * @returns
 */
export const ExplorerDialog: React.FC<ExplorerDialogProps> = props => {
  const { currentSessionId, currentEvent } = useSelector((state: RootState) => state.explorerView);

  return (
    <EventDialog
      currentSessionId={currentSessionId}
      currentEvent={currentEvent ? currentEvent : null}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      dialogType={NavBarViewDialog.EditEvent}
      setIsSecondaryOpen={props.setIsSecondaryOpen}
      setSnackbarSuccess={props.setSnackbarSuccess}
      setSnackbarError={props.setSnackbarError}
      isShownInExplorer
    />
  );
};
