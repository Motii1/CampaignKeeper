import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { NavBarViewDialog } from '../../../../../../../../../../types/types';
import { SessionEventWithPos } from '../../../../../../../../eventsSlice';
import { setCurrentEvent } from '../../../../../../../../mapViewSlice';
import { DisplayStatusIcon } from './components/DisplayStatusIcon/DisplayStatusIcon';
import { StatusIcon } from './components/StatusIcon/StatusIcon';

type EventMenuProps = {
  title: string;
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

// TO-DO: add logic to icons and changing them according to state
export const EventMenu: React.FC<EventMenuProps> = props => {
  const dispatch = useDispatch();

  const handleEditIcon = () => {
    dispatch(setCurrentEvent({ currentEvent: props.event }));
    props.setDialogType(NavBarViewDialog.EditEvent);
    props.setIsOpen(true);
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ width: '100%', minHeight: 21 }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          width: '230px',
          marginLeft: '70px',
          color: 'customPalette.onAccent',
          fontWeight: 'bold',
          height: '100%',
          display: 'inline-block',
          verticalAlign: 'middle',
          lineHeight: 'normal',
        }}
      >
        {props.title}
      </Typography>
      <EditOutlinedIcon
        onClick={handleEditIcon}
        fontSize="small"
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
      <DisplayStatusIcon event={props.event} />
      <StatusIcon event={props.event} />
    </Stack>
  );
};
