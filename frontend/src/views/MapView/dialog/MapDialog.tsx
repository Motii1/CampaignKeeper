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

/**
 * Component serving as main dialog in MapView, used for creation of new events
 * and editing/deleting existing ones. Can be opened in "create new event" mode
 * (all fields are empty) by FAB or "edit existing event" by clicking on edit icon
 * in EventTile.
 * NOTE: during to similiarites in UI and function
 * between primary dialog in MapView and ExplorerView,
 * this component is actually wrapper for uniform EventDialog
 * @param props
 * @returns
 */
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
