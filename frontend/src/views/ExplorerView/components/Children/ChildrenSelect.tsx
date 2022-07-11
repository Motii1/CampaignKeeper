import { Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { CustomSnackbar } from '../../../components/CustomSnackbar/CustomSnackbar';
import { useSnackbar } from '../../../components/CustomSnackbar/useSnackbar';
import { SessionEventWithPos } from '../../../MapView/eventsSlice';
import { AddChildDialog } from './components/AddChildDialog/AddChildDialog';
import { ChildChip } from './components/ChildChip/ChildChip';
import { NewChildChip } from './components/NewChildChip/NewChildChip';

type ChildrenSelectProps = {
  currentSessionId: string;
  currentEvent: SessionEventWithPos;
  eventsList: SessionEventWithPos[];
};

export const ChildrenSelect: React.FC<ChildrenSelectProps> = props => {
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const { snackbarProperties, setSnackbarSuccess, setSnackbarError } = useSnackbar();

  const renderChildren = () => (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{
        width: '1000px',
      }}
    >
      {props.eventsList
        .filter(event => props.currentEvent.childrenIds.includes(event.id))
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
        width: ' 1200px',
        height: '200px',
        backgroundColor: 'customPalette.surface',
      }}
    >
      <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={4}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: '0px',
            width: ' 1150px',
            height: '140px',
            backgroundColor: 'customPalette.background',
          }}
        >
          {renderChildren()}
        </Paper>
      </Stack>
      <AddChildDialog
        currentSessionId={props.currentSessionId}
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
