/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
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
import { addEvent, SessionEvent } from '../eventsSlice';
import { EventSelect } from './components/EventSelect/EventSelect';
import { MapFieldList } from './components/MapFieldList/MapFieldList';
import { Parent } from './components/Parent/Parent';
import { ParentsBar } from './components/ParentsBar/ParentsBar';

// type NewEventData = {
//   title: string;
//   sessionId: string;
//   type: string;
//   status: string;
//   placeMetadataArray: EventFieldMetadata[];
//   descriptionMetadataArray: EventFieldMetadata[];
//   charactersMetadataArray: EventFieldMetadata[];
//   parentIds: string[];
// };

type MapDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const MapDialog: React.FC<MapDialogProps> = props => {
  const dispatch = useDispatch();
  const { currentSessionId, currentEvent } = useSelector((state: RootState) => state.mapView);
  const { eventsList } = useSelector((state: RootState) => state.events);
  const { entries } = useSelector((state: RootState) => state.codex);

  // TO-DO: move to another file?
  const possibleType = useMemo(() => ['normal', 'fight'], []);
  const possibleStatus = useMemo(() => ['none', 'done', 'omitted'], []);
  const referenceFieldNames = useMemo(() => ['Place', 'Characters', 'Description'], []);

  const [dialogTitle, setDialogTitle] = useState(
    props.dialogType === NavBarViewDialog.NewEvent ? 'Create new event' : 'Edit event'
  );
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventTitleHelperText, setEventTitleHelperText] = useState<string>('');
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [type, setType] = useState<string>(possibleType[0]);
  const [status, setStatus] = useState<string>(possibleStatus[0]);
  const [referenceFields, setReferenceFields] = useState(
    createEmptyEventFields(referenceFieldNames)
  );

  useEffect(() => {
    if (props.dialogType === NavBarViewDialog.NewEvent) {
      setDialogTitle('Create new event');
      setEventTitle('');
      setEventTitleHelperText('');
      setParentIds([]);
      setType(possibleType[0]);
      setStatus(possibleStatus[0]);
      setReferenceFields(createEmptyEventFields(referenceFieldNames));
    } else {
      if (currentEvent) {
        setDialogTitle('Edit event');
        setEventTitle(currentEvent.title);
        setEventTitleHelperText('');
        setParentIds(currentEvent.parentIds);
        setType(currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1));
        setStatus(currentEvent.status.charAt(0).toUpperCase() + currentEvent.status.slice(1));
        setReferenceFields(createFilledEventFields(referenceFieldNames, currentEvent, entries));
      } else props.setIsOpen(false);
    }
  }, [currentEvent, entries, possibleStatus, possibleType, props, referenceFieldNames]);

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
    setType(possibleType[0]);
    setStatus(possibleStatus[0]);
    setReferenceFields(createEmptyEventFields(referenceFieldNames));
  }, [possibleStatus, possibleType, referenceFieldNames]);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addEvent({ newEvent: dataNew }));
        props.setSnackbarSuccess('Event created');
        props.setIsOpen(false);
        resetDialog();
      } else if (statusNew === 400) props.setSnackbarError('Error during event creation');

      resetQueryNew();
    }
  }, [dataNew, dispatch, isLoadingNew, props, resetDialog, resetQueryNew, statusNew]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

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
      runQueryNew({
        title: eventTitle,
        sessionId: currentSessionId,
        type: type,
        status: status,
        placeMetadataArray: convertReferenceFieldToEventMetadata(referenceFields['Place']),
        descriptionMetadataArray: convertReferenceFieldToEventMetadata(
          referenceFields['Description']
        ),
        charactersMetadataArray: convertReferenceFieldToEventMetadata(
          referenceFields['Characters']
        ),
        parentIds: parentIds,
      });
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };
  const handleDelete = () => {};

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
        Events without parents will be children of start
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
          <ParentsBar parents={parentIds} setParents={setParentIds} />
          {renderParents()}
          <EventSelect
            title="Type"
            id="event-type-select"
            setValue={setType}
            items={possibleType}
            defaultValue={type}
          />
          <EventSelect
            title="Status"
            id="event-status-select"
            setValue={setStatus}
            items={possibleStatus}
            defaultValue={status}
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
