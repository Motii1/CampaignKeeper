import { Box, MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { SecondaryEventDialogType } from '../../../types/types';
import { compareEventsByTitle } from '../../../utils/utils';
import { setCurrentEvent as setCurrentEventExplorer } from '../../ExplorerView/explorerViewSlice';
import { deleteEvent, SessionEventWithPos } from '../../MapView/eventsSlice';
import { setCurrentEvent as setCurrentEventMap } from '../../MapView/mapViewSlice';
import { CustomDialog } from '../CustomDialog/CustomDialog';
import { CustomSelect } from '../CustomSelect/CustomSelect';

type deleteEventData = {
  parentId: string;
};

type EventSecondaryDialogProps = {
  type: SecondaryEventDialogType;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const EventSecondaryDialog: React.FC<EventSecondaryDialogProps> = props => {
  const dispatch = useDispatch();
  const currentEventMap = useSelector((state: RootState) => state.mapView.currentEvent);
  const currentEventExplorer = useSelector((state: RootState) => state.explorerView.currentEvent);
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [currentEvent, setCurrentEvent] = useState<null | SessionEventWithPos>(null);
  const [newParent, setNewParent] = useState<string | null>(null);

  useEffect(() => {
    if (props.type === SecondaryEventDialogType.Map) setCurrentEvent(currentEventMap);
    else setCurrentEvent(currentEventExplorer);
  }, [props.type, currentEventMap, currentEventExplorer]);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery<deleteEventData>(`/api/event/${currentEvent?.id}`, requestMethods.DELETE);

  const handleRunQueryDelete = useCallback(() => {
    if (!isLoadingDelete && statusDelete) {
      if (statusDelete === 200) {
        dispatch(deleteEvent({ deletedEvent: currentEvent, newParent: newParent }));
        if (props.type === SecondaryEventDialogType.Map)
          dispatch(setCurrentEventMap({ currentEvent: null }));
        else {
          const newParentEvent = eventsList.find(event => event.id === newParent);
          dispatch(
            setCurrentEventExplorer({ currentEvent: newParentEvent ? newParentEvent : null })
          );
        }
        props.setSnackbarSuccess('Event deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during event deletion');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [
    currentEvent,
    dispatch,
    eventsList,
    isLoadingDelete,
    newParent,
    props,
    resetQueryDelete,
    statusDelete,
  ]);

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
      .filter(
        event => event.id !== currentEvent?.id && !currentEvent?.childrenIds.includes(event.id)
      )
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
    else if (currentEvent?.childrenIds.length === 0) runQueryDelete();
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
          <Typography variant="h6" sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}>
            {"This action can't be undone."}
          </Typography>
          {currentEvent?.childrenIds.length !== 0 ? (
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
        </Stack>
      </CustomDialog>
    </Box>
  );
};
