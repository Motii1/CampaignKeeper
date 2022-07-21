import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { EventDialog } from '../../components/EventDialog/EventDialog';

type MapDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const MapDialog: React.FC<MapDialogProps> = props => {
  const { currentSessionId, currentEvent } = useSelector((state: RootState) => state.mapView);

  return (
    <EventDialog
      currentSessionId={currentSessionId}
      currentEvent={currentEvent}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      dialogType={props.dialogType}
      setIsSecondaryOpen={props.setIsSecondaryOpen}
      setSnackbarSuccess={props.setSnackbarSuccess}
      setSnackbarError={props.setSnackbarError}
    />
  );
};
