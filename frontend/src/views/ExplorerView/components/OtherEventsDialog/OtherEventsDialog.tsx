import { Box, Stack } from '@mui/material';
import { EventTileType } from '../../../../types/types';
import { CustomDialog } from '../../../components/CustomDialog/CustomDialog';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { EventTile } from '../../../components/EventTile/EventTile';
import { SessionEventWithPos } from '../../../MapView/eventsSlice';

type OtherEventsDialogProps = {
  title: string;
  isOpen: boolean;
  setIsOpen: (newOpen: boolean) => void;
  otherEvents: SessionEventWithPos[];
};

export const OtherEventsDialog: React.FC<OtherEventsDialogProps> = props => {
  const renderOtherEvents = () =>
    props.otherEvents.length > 0 ? (
      props.otherEvents.map(event => (
        <EventTile
          event={event}
          type={EventTileType.ExplorerParent}
          setIsOpen={props.setIsOpen}
          key={event.id}
        />
      ))
    ) : (
      <Box sx={{ paddingBottom: '20px' }}>
        <EmptyPlaceholder message={'No event to choose'} />
      </Box>
    );

  return (
    <CustomDialog title={props.title} isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        {renderOtherEvents()}
      </Stack>
    </CustomDialog>
  );
};
