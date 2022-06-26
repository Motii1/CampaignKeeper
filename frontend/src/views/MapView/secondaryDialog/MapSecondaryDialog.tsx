import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { deleteEvent } from '../eventsSlice';
import { setCurrentEvent } from '../mapViewSlice';

type MapSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const MapSecondaryDialog: React.FC<MapSecondaryDialogProps> = props => {
  const dispatch = useDispatch();
  const eventId = useSelector((state: RootState) => state.mapView.currentEvent?.id);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery(`/api/event/${eventId}`, requestMethods.DELETE);

  const handleRunQueryDelete = useCallback(() => {
    if (!isLoadingDelete && statusDelete) {
      if (statusDelete === 200) {
        dispatch(deleteEvent({ id: eventId }));
        dispatch(setCurrentEvent({ currentEvent: null }));
        props.setSnackbarSuccess('Event deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during event deletion');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [dispatch, eventId, isLoadingDelete, props, resetQueryDelete, statusDelete]);

  useEffect(() => {
    handleRunQueryDelete();
  }, [handleRunQueryDelete]);

  const handleOk = () => {
    runQueryDelete();
  };

  const handleCancel = () => {
    props.setIsOpen(false);
  };

  return (
    <Box>
      <CustomDialog
        title={'Are you sure?'}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography variant="h6" sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}>
          {"This action can't be undone."}
        </Typography>
      </CustomDialog>
    </Box>
  );
};
