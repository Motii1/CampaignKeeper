import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventTileType, NavBarViewDialog } from '../../../../../types/types';
import { setCurrentEvent as setCurrentEventExplorerView } from '../../../../ExplorerView/explorerViewSlice';
import { SessionEventWithPos } from '../../../../MapView/eventsSlice';
import { setCurrentEvent as setCurrentEventMapView } from '../../../../MapView/mapViewSlice';
import viewsRoutes from '../../../../viewsRoutes';
import { DisplayStatusIcon } from './components/DisplayStatusIcon/DisplayStatusIcon';
import { EditIcon } from './components/EditIcon/EditIcon';
import { StatusIcon } from './components/StatusIcon/StatusIcon';

type EventBarProps = {
  event: SessionEventWithPos;
  setIsOpen?: (newIsOpen: boolean) => void;
  setDialogType?: (newDialogType: NavBarViewDialog) => void;
  type: EventTileType;
};

export const EventBar: React.FC<EventBarProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleTitleClick = () => {
    dispatch(setCurrentEventExplorerView({ currentEvent: props.event }));
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
      <Tooltip title={props.type === EventTileType.Map ? '' : 'Click to view event in Explorer'}>
        <Typography
          sx={{
            textAlign: 'center',
            width: props.type ? '460px' : '230px',
            marginLeft: props.type ? '0px' : '70px',
            color: props.event.type === 'normal' ? 'customPalette.onAccent' : 'customPalette.onRed',
            fontWeight: 'bold',
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: 'normal',
            cursor: props.type === EventTileType.Map ? 'pointer' : 'default',
          }}
          onClick={props.type === EventTileType.Map ? handleTitleClick : undefined}
          variant={props.type === EventTileType.Explorer ? 'h6' : 'subtitle1'}
        >
          {props.event.title}
        </Typography>
      </Tooltip>
      {props.type === EventTileType.Map ? <EditIcon handleClick={handleEditIcon} /> : null}
      {props.type === EventTileType.Map ? <DisplayStatusIcon event={props.event} /> : null}
      {props.type === EventTileType.Map ? <StatusIcon event={props.event} /> : null}
    </Stack>
  );
};
