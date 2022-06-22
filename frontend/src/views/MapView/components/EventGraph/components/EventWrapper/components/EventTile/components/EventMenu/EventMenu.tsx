import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { NavBarViewDialog } from '../../../../../../../../../../types/types';
import { SessionEventWithPos } from '../../../../../../../../eventsSlice';
import { setCurrentEvent } from '../../../../../../../../mapViewSlice';

type EventMenuProps = {
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

// TO-DO: add logic to icons and changing them according to state
export const EventMenu: React.FC<EventMenuProps> = props => {
  const dispatch = useDispatch();

  const handleEditIcon = () => {
    dispatch(setCurrentEvent({ currentEvent: props.event }));
    props.setDialogType(NavBarViewDialog.EditEntry);
    props.setIsOpen(true);
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', right: '6px', top: '6px' }}
    >
      <EditOutlinedIcon
        onClick={handleEditIcon}
        fontSize="small"
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
      <VisibilityOutlinedIcon
        fontSize="small"
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
      <CheckBoxOutlinedIcon
        fontSize="small"
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    </Stack>
  );
};
