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
