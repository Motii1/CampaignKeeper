import { Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { compareEventsByTitle } from '../../../../utils/utils';
import { CustomSnackbar } from '../../../components/CustomSnackbar/CustomSnackbar';
import { useSnackbar } from '../../../components/CustomSnackbar/useSnackbar';
import { SessionEventWithPos } from '../../../MapView/eventsSlice';
import { OtherEventsDialog } from '../OtherEventsDialog/OtherEventsDialog';
import { AddChildDialog } from './components/AddChildDialog/AddChildDialog';
import { ChildChip } from './components/ChildChip/ChildChip';
import { NewChildChip } from './components/NewChildChip/NewChildChip';
import { OtherEventsButton } from './components/OtherEventsButton/OtherEventsButton';

type OtherEventsPanelProps = {
  currentSessionId: string;
  currentEvent: SessionEventWithPos;
  eventsList: SessionEventWithPos[];
};

export const OtherEventsPanel: React.FC<OtherEventsPanelProps> = props => {
  const [isPrevEventOpen, setIsPrevEventOpen] = useState(false);
  const [isNextEventOpen, setIsNextEventOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const { snackbarProperties, setSnackbarSuccess, setSnackbarError } = useSnackbar();

  const renderChildren = () => (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{
        width: '1050px',
        margin: '50px',
      }}
    >
      {props.eventsList
        .filter(event => props.currentEvent.childrenIds.includes(event.id))
        .sort(compareEventsByTitle)
        .map(event => (
          <ChildChip event={event} key={event.id} />
        ))}
      <NewChildChip setIsOpen={setIsAddChildOpen} />
    </Stack>
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: '0px',
        width: '1200px',
        height: '220px',
        borderRadius: '20px 20px 0px 0px',
        backgroundColor: 'customPalette.surface',
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ marginTop: '20px' }}
      >
        <OtherEventsButton content={'Prev event'} setIsOpen={setIsPrevEventOpen} />
        <OtherEventsButton content={'Next event'} setIsOpen={setIsNextEventOpen} />
      </Stack>
      <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={4}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: '0px',
            width: '1150px',
            height: '150px',
            borderRadius: '20px 20px 0px 0px',
            backgroundColor: 'customPalette.background',
          }}
        >
          {renderChildren()}
        </Paper>
      </Stack>
      <OtherEventsDialog
        title={'Choose previous event'}
        isOpen={isPrevEventOpen}
        setIsOpen={setIsPrevEventOpen}
        otherEvents={props.eventsList.filter(event =>
          props.currentEvent.parentIds.includes(event.id)
        )}
      />
      <OtherEventsDialog
        title={'Choose next event'}
        isOpen={isNextEventOpen}
        setIsOpen={setIsNextEventOpen}
        otherEvents={props.eventsList.filter(event =>
          props.currentEvent.childrenIds.includes(event.id)
        )}
      />
      <AddChildDialog
        currentSessionId={props.currentSessionId}
        currentEvent={props.currentEvent}
        parentId={props.currentEvent.id}
        isOpen={isAddChildOpen}
        setIsOpen={setIsAddChildOpen}
        setSnackbarSuccess={setSnackbarSuccess}
        setSnackbarError={setSnackbarError}
      />
      <CustomSnackbar
        message={snackbarProperties.message}
        type={snackbarProperties.type}
        isOpen={snackbarProperties.isOpen}
        setIsOpen={snackbarProperties.setIsOpen}
      />
    </Paper>
  );
};
