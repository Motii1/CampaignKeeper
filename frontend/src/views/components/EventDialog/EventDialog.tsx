import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import {
  convertReferenceFieldToEventMetadata,
  createEmptyEventFields,
  createFilledEventFields,
} from '../../../utils/utils';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { setCurrentEvent as setCurrentEventExplorerView } from '../../ExplorerView/explorerViewSlice';
import {
  addEvent,
  editEvent,
  EventFieldMetadata,
  SessionEvent,
  SessionEventWithPos,
} from '../../MapView/eventsSlice';
import { EventSelect } from './components/EventSelect/EventSelect';
import { MapFieldList } from './components/MapFieldList/MapFieldList';
import { Parent } from './components/Parent/Parent';
import { ParentsBar } from './components/ParentsBar/ParentsBar';

export type EditEventData = {
  title: string;
  type: string;
  status: string;
  displayStatus: string;
  placeMetadataArray: EventFieldMetadata[];
  descriptionMetadataArray: EventFieldMetadata[];
  charactersMetadataArray: EventFieldMetadata[];
  parentIds: string[];
};

type EventDialogProps = {
  currentSessionId: string;
  currentEvent: null | SessionEventWithPos;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
  isShownInExplorer?: boolean;
  parentId?: string;
};

/**
 * Dialog used to create, edit and delete events in MapView and ExplorerView.
 * Due to similiarity in UI and slight diffrence in field content,
 * MapDialog and ExplorerDialog are actually just wrapper on EventDialog
 * and pass props required for its opening in proper mode.
 * That is EventDialog in MapView can be opened in "new event" (all fields are empty)
 * and "edit event" mode (all fields are filled with data from some event)
 * and in ExplorerView it can be opened in "edit event" (as above) and "new child event"
 * (all field empty except for parents field which contains parent of new event)
 * @param props
 * @returns
 */
export const EventDialog: React.FC<EventDialogProps> = props => {
  const dispatch = useDispatch();
  const { eventsList } = useSelector((state: RootState) => state.events);
  const { entries } = useSelector((state: RootState) => state.codex);

  const possibleType = useMemo(() => ['normal', 'fight'], []);
  const possibleStatus = useMemo(() => ['none', 'done', 'omitted'], []);
  const referenceFieldNames = useMemo(() => ['Place', 'Characters', 'Description'], []);

  const [dialogTitle, setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEvent ? 'Create new event' : 'Edit event'
  );
  const [eventTitle, setEventTitle] = useState<string>(
    props.isShownInExplorer && props.currentEvent ? props.currentEvent.title : ''
  );
  const [eventTitleHelperText, setEventTitleHelperText] = useState<string>('');
  const [parentIds, setParentIds] = useState<string[]>(
    props.isShownInExplorer && props.parentId
      ? [props.parentId]
      : props.currentEvent
      ? props.currentEvent.parentIds
      : []
  );

  const [eventType, setEventType] = useState<string>(
    props.isShownInExplorer && props.currentEvent ? props.currentEvent.type : possibleType[0]
  );
  const [eventStatus, setEventStatus] = useState<string>(
    props.isShownInExplorer && props.currentEvent ? props.currentEvent.status : possibleStatus[0]
  );
  const [referenceFields, setReferenceFields] = useState(
    props.isShownInExplorer && props.currentEvent
      ? createFilledEventFields(referenceFieldNames, props.currentEvent, entries)
      : createEmptyEventFields(referenceFieldNames)
  );

  useEffect(() => {
    if (props.dialogType === NavBarViewDialog.NewEvent) {
      setDialogTitle('Create new event');
      setEventTitle('');
      setEventTitleHelperText('');
      setParentIds(props.parentId ? [props.parentId] : []);
      setEventType(possibleType[0]);
      setEventStatus(possibleStatus[0]);
      setReferenceFields(createEmptyEventFields(referenceFieldNames));
    } else if (props.currentEvent) {
      setDialogTitle('Edit event');
      setEventTitle(props.currentEvent.title);
      setEventTitleHelperText('');
      setParentIds(props.currentEvent.parentIds);
      setEventType(props.currentEvent.type);
      setEventStatus(props.currentEvent.status);
      setReferenceFields(createFilledEventFields(referenceFieldNames, props.currentEvent, entries));
    }
  }, [entries, possibleStatus, possibleType, props, referenceFieldNames]);

  const {
    isLoading: isLoadingNew,
    data: dataNew,
    status: statusNew,
    runQuery: runQueryNew,
    resetQuery: resetQueryNew,
  } = useQuery<SessionEvent>(`/api/event`, requestMethods.POST);

  const resetDialog = useCallback(() => {
    setEventTitle('');
    setEventTitleHelperText('');
    setParentIds([]);
    setEventType(possibleType[0]);
    setEventStatus(possibleStatus[0]);
    setReferenceFields(createEmptyEventFields(referenceFieldNames));
  }, [possibleStatus, possibleType, referenceFieldNames]);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addEvent({ newEvent: dataNew }));
        props.setSnackbarSuccess('Event created');
        props.setIsOpen(false);
        resetDialog();
        if (props.isShownInExplorer && dataNew) {
          dispatch(
            setCurrentEventExplorerView({
              currentEvent: {
                ...props.currentEvent,
                childrenIds: props.currentEvent?.childrenIds.concat(dataNew.id),
              },
            })
          );
        }
      } else if (statusNew === 400) props.setSnackbarError('Error during event creation');

      resetQueryNew();
    }
  }, [dataNew, dispatch, isLoadingNew, props, resetDialog, resetQueryNew, statusNew]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

  const {
    isLoading: isLoadingEdit,
    status: statusEdit,
    runQuery: runQueryEdit,
    resetQuery: resetQueryEdit,
  } = useQuery<EditEventData>(`/api/event/${props.currentEvent?.id}`, requestMethods.PATCH);

  const handleRunQueryEdit = useCallback(() => {
    if (!isLoadingEdit && statusEdit) {
      if (statusEdit === 200) {
        const editedEvent = {
          id: props.currentEvent?.id,
          title: eventTitle,
          sessionId: props.currentEvent?.sessionId,
          type: eventType,
          status: eventStatus,
          displayStatus: props.currentEvent?.displayStatus,
          placeMetadataArray: convertReferenceFieldToEventMetadata(referenceFields['Place']),
          descriptionMetadataArray: convertReferenceFieldToEventMetadata(
            referenceFields['Description']
          ),
          charactersMetadataArray: convertReferenceFieldToEventMetadata(
            referenceFields['Characters']
          ),
          parentIds: parentIds,
          childrenIds: props.currentEvent?.childrenIds,
        };
        dispatch(
          editEvent({
            editedEvent: editedEvent,
          })
        );
        if (props.isShownInExplorer) {
          dispatch(setCurrentEventExplorerView({ currentEvent: editedEvent }));
        }

        props.setSnackbarSuccess('Event edited');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusNew === 400) props.setSnackbarError('Error during editing event');

      resetQueryEdit();
    }
  }, [
    dispatch,
    eventStatus,
    eventTitle,
    eventType,
    isLoadingEdit,
    parentIds,
    props,
    referenceFields,
    resetDialog,
    resetQueryEdit,
    statusEdit,
    statusNew,
  ]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  const handleEventTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEventTitle(event.target.value);
    setEventTitleHelperText('');
  };

  const handleEventTitleLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = event.target.value;
    setEventTitle(newTitle);
    setEventTitleHelperText(() => {
      if (newTitle.length === 0) return "Event name can't be empty";
      if (newTitle.length > 128) return 'Event name is too long';
      return '';
    });
  };

  const handleOk = () => {
    if (eventTitleHelperText === '')
      if (props.dialogType === NavBarViewDialog.NewEvent) {
        if (parentIds.length === 0 && eventsList.length > 0)
          props.setSnackbarError('Session can have only one starting event');
        else
          runQueryNew({
            title: eventTitle,
            sessionId: props.currentSessionId,
            type: eventType,
            status: eventStatus,
            placeMetadataArray: convertReferenceFieldToEventMetadata(referenceFields['Place']),
            descriptionMetadataArray: convertReferenceFieldToEventMetadata(
              referenceFields['Description']
            ),
            charactersMetadataArray: convertReferenceFieldToEventMetadata(
              referenceFields['Characters']
            ),
            parentIds: parentIds,
          });
      } else {
        if (
          parentIds.length === 0 &&
          eventsList.length > 0 &&
          !(eventsList.find(event => event.id === props.currentEvent?.id)?.parentIds.length === 0)
        )
          props.setSnackbarError('Session can have only one starting event');
        else
          runQueryEdit({
            title: eventTitle,
            type: eventType,
            status: eventStatus,
            displayStatus: props.currentEvent?.displayStatus,
            placeMetadataArray: convertReferenceFieldToEventMetadata(referenceFields['Place']),
            descriptionMetadataArray: convertReferenceFieldToEventMetadata(
              referenceFields['Description']
            ),
            charactersMetadataArray: convertReferenceFieldToEventMetadata(
              referenceFields['Characters']
            ),
            parentIds: parentIds,
          });
      }
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  const handleDelete = () => {
    if (parentIds.length === 0 && eventsList.length > 1) {
      props.setSnackbarError('Cannot delete root with existing children!');
      handleCancel();
      return;
    }
    if (props.setIsSecondaryOpen) props.setIsSecondaryOpen(true);
  };

  const renderParents = () =>
    parentIds.length > 0 ? (
      parentIds.map(parentId => (
        <Parent
          key={parentId}
          name={eventsList.find(event => event.id === parentId)?.title}
          id={parentId}
          parents={parentIds}
          setParents={setParentIds}
        />
      ))
    ) : (
      <Typography
        variant="subtitle2"
        sx={{ color: 'customPalette.onSurface', fontStyle: 'italic', paddingLeft: '5px' }}
      >
        {"Event without parents will be session's starting event"}
      </Typography>
    );

  return (
    <CustomDialog
      title={dialogTitle}
      isOpen={props.isOpen}
      isLarge={false}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onDelete={props.dialogType === NavBarViewDialog.EditEvent ? handleDelete : undefined}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2.7}
        sx={{
          width: '100%',
          minWidth: '100%',
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
          sx={{
            minWidth: '100%',
          }}
        >
          <LabeledTextInput
            text={'Title'}
            value={eventTitle}
            placeholder={''}
            helperText={eventTitleHelperText}
            defaultHelperText={''}
            onChange={event => handleEventTitleChange(event)}
            onBlur={event => handleEventTitleLeave(event)}
          />
          <ParentsBar
            currentEventId={
              props.currentEvent && props.dialogType === NavBarViewDialog.EditEvent
                ? props.currentEvent.id
                : ''
            }
            parents={parentIds}
            setParents={setParentIds}
          />
          {renderParents()}
          <EventSelect
            title="Type"
            id="event-type-select"
            value={eventType}
            setValue={setEventType}
            items={possibleType}
          />
          <EventSelect
            title="Status"
            id="event-status-select"
            value={eventStatus}
            setValue={setEventStatus}
            items={possibleStatus}
          />
          <MapFieldList
            fieldNames={referenceFieldNames}
            fields={referenceFields}
            setFields={setReferenceFields}
          />
        </Stack>
      </Stack>
    </CustomDialog>
  );
};
