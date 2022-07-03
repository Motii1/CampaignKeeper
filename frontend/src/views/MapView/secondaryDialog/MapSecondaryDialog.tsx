import { Box, MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { compareEventsByTitle } from '../../../utils/utils';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { CustomSelect } from '../../components/CustomSelect/CustomSelect';
import { deleteEvent } from '../eventsSlice';
import { setCurrentEvent } from '../mapViewSlice';

type deleteEventData = {
  parentId: string;
};

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
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [newParent, setNewParent] = useState<string | null>(null);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery<deleteEventData>(`/api/event/${eventId}`, requestMethods.DELETE);

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

  const handleChange = (event: SelectChangeEvent) => {
    setNewParent(event.target.value);
  };

  const renderValue = (value: string) => {
    if (value !== '') return eventsList.find(event => event.id === value)?.title;
    return 'Choose parent';
  };

  const renderItems = () => {
    const possibleNewParents = eventsList
      .filter(event => event.id !== eventId)
      .sort(compareEventsByTitle)
      .map(event => (
        <MenuItem value={event.id} key={event.id}>
          {event.title}
        </MenuItem>
      ));

    return possibleNewParents;
  };

  const handleOk = () => {
    if (newParent) runQueryDelete({ parentId: newParent });
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
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
          {eventsList.find(event => event.id === eventId)?.childrenIds !== [] ? (
            <>
              <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface' }}>
                Select new parent for children events:
              </Typography>
              <CustomSelect
                labelId={'event-new-parent-select'}
                handleChange={handleChange}
                value={newParent ? newParent : ''}
                renderValue={renderValue}
              >
                {renderItems()}
              </CustomSelect>
            </>
          ) : null}
          <Typography variant="h6" sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}>
            {"This action can't be undone."}
          </Typography>
        </Stack>
      </CustomDialog>
    </Box>
  );
};
