import { Stack } from '@mui/material';
import { CustomDialog } from '../../../components/CustomDialog/CustomDialog';
import { EventTile } from '../../../components/EventTile/EventTile';
import { SessionEventWithPos } from '../../../MapView/eventsSlice';

type ParentDialogProps = {
  isOpen: boolean;
  setIsOpen: (newOpen: boolean) => void;
  parentEvents: SessionEventWithPos[];
};

export const ParentDialog: React.FC<ParentDialogProps> = props => {
  const renderParentEvents = () =>
    props.parentEvents.map(event => <EventTile event={event} key={event.id} />);

  return (
    <CustomDialog
      title={'Choose previous event'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      isLarge
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        {renderParentEvents()}
      </Stack>
    </CustomDialog>
  );
};
