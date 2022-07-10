import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../../../types/types';
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
  isShownInExplorer?: boolean;
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
      {props.isShownInExplorer ? null : <EditIcon handleClick={handleEditIcon} />}
      {props.isShownInExplorer ? null : <DisplayStatusIcon event={props.event} />}
      {props.isShownInExplorer ? null : <StatusIcon event={props.event} />}
    </Stack>
  );
};
