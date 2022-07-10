import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../../../../../../../../types/types';
import { setCurrentEvent as setCurrentEventExplorerView } from '../../../../../../../../../ExplorerView/explorerViewSlice';
import viewsRoutes from '../../../../../../../../../viewsRoutes';
import { SessionEventWithPos } from '../../../../../../../../eventsSlice';
import { setCurrentEvent as setCurrentEventMapView } from '../../../../../../../../mapViewSlice';
import { DisplayStatusIcon } from './components/DisplayStatusIcon/DisplayStatusIcon';
import { StatusIcon } from './components/StatusIcon/StatusIcon';

type EventMenuProps = {
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EventMenu: React.FC<EventMenuProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleTitleClick = () => {
    dispatch(setCurrentEventExplorerView({ currentEvent: props.event }));
    history.push(viewsRoutes.EXPLORER);
  };

  const handleEditIcon = () => {
    dispatch(setCurrentEventMapView({ currentEvent: props.event }));
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
      <Tooltip title="Click to view event in Explorer">
        <Typography
          sx={{
            textAlign: 'center',
            width: '230px',
            marginLeft: '70px',
            color: props.event.type === 'normal' ? 'customPalette.onAccent' : 'customPalette.onRed',
            fontWeight: 'bold',
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: 'normal',
            cursor: 'pointer',
          }}
          onClick={handleTitleClick}
        >
          {props.event.title}
        </Typography>
      </Tooltip>
      <Tooltip title="Edit event">
        <EditOutlinedIcon
          onClick={handleEditIcon}
          fontSize="small"
          sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
        />
      </Tooltip>
      <DisplayStatusIcon event={props.event} />
      <StatusIcon event={props.event} />
    </Stack>
  );
};
