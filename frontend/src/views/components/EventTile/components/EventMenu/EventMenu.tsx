import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../../../types/types';
import { setCurrentEventId as setCurrentEventExplorerView } from '../../../../ExplorerView/explorerViewSlice';
import { SessionEventWithPos } from '../../../../MapView/eventsSlice';
import { setCurrentEvent as setCurrentEventMapView } from '../../../../MapView/mapViewSlice';
import viewsRoutes from '../../../../viewsRoutes';
import { DisplayStatusIcon } from './components/DisplayStatusIcon/DisplayStatusIcon';
import { StatusIcon } from './components/StatusIcon/StatusIcon';

type EventMenuProps = {
  event: SessionEventWithPos;
  setIsOpen?: (newIsOpen: boolean) => void;
  setDialogType?: (newDialogType: NavBarViewDialog) => void;
  isShownInExplorer?: boolean;
};

export const EventMenu: React.FC<EventMenuProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleTitleClick = () => {
    dispatch(setCurrentEventExplorerView({ currentEventId: props.event.id }));
    history.push(viewsRoutes.EXPLORER);
  };

  const handleEditIcon = () => {
    if (props.setIsOpen && props.setDialogType) {
      dispatch(setCurrentEventMapView({ currentEvent: props.event }));
      props.setDialogType(NavBarViewDialog.EditEvent);
      props.setIsOpen(true);
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ width: '100%', minHeight: 21 }}
    >
      <Tooltip title={props.isShownInExplorer ? '' : 'Click to view event in Explorer'}>
        <Typography
          sx={{
            textAlign: 'center',
            width: props.isShownInExplorer ? '460px' : '230px',
            marginLeft: props.isShownInExplorer ? '0px' : '70px',
            color: props.event.type === 'normal' ? 'customPalette.onAccent' : 'customPalette.onRed',
            fontWeight: 'bold',
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: 'normal',
            cursor: props.isShownInExplorer ? 'default' : 'pointer',
          }}
          onClick={props.isShownInExplorer ? undefined : handleTitleClick}
          variant={props.isShownInExplorer ? 'h6' : 'subtitle1'}
        >
          {props.event.title}
        </Typography>
      </Tooltip>
      {props.isShownInExplorer ? null : (
        <Tooltip title="Edit event">
          <EditOutlinedIcon
            onClick={handleEditIcon}
            fontSize="small"
            sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
          />
        </Tooltip>
      )}
      {props.isShownInExplorer ? null : <DisplayStatusIcon event={props.event} />}
      <StatusIcon event={props.event} />
    </Stack>
  );
};
