import { Paper, Stack } from '@mui/material';
import { SessionEventWithPos } from '../../../MapView/eventsSlice';
import { ChildChip } from './components/ChildChip/ChildChip';

type ChildrenSelectProps = {
  currentEvent: SessionEventWithPos;
  eventsList: SessionEventWithPos[];
};

export const ChildrenSelect: React.FC<ChildrenSelectProps> = props => {
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
    </Paper>
  );
};
