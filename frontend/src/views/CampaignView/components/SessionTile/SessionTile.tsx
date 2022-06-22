import { Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../../types/types';
import { EditMenu } from '../../../components/EditMenu/EditMenu';
import { resetState as resetEventsState } from '../../../MapView/eventsSlice';
import { setSessionId } from '../../../MapView/mapViewSlice';
import viewsRoutes from '../../../viewsRoutes';
import { updateState as updateStateCampaign } from '../../campaignViewSlice';

type SessionTileProps = {
  sessionId: string;
  sessionName: string;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const SessionTile: React.FC<SessionTileProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

  const handleClick = () => {
    dispatch(setSessionId({ currentSessionId: props.sessionId }));
    dispatch(resetEventsState({}));
    history.push(viewsRoutes.MAP);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPos(
      menuPos === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleClose = () => {
    setMenuPos(null);
  };

  const handleEdit = () => {
    dispatch(updateStateCampaign({ sessionName: props.sessionName, sessionId: props.sessionId }));
    props.setIsOpen(true);
    props.setDialogType(NavBarViewDialog.EditSession);
    setMenuPos(null);
  };

  return (
    <Paper
      sx={{
        cursor: 'pointer',
        borderRadius: 2.5,
        backgroundColor: 'customPalette.surface',
        height: 40,
        width: { xs: 259.8, lg: 371.2 },
        padding: 0.66,
        marginRight: 2,
        marginLeft: 2,
        marginTop: 1.2,
        marginBlock: 1.2,
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <Typography
        sx={{
          color: 'customPalette.onSurface',
          fontWeight: 'medium',
          textAlign: 'left',
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingTop: 1.0,
        }}
      >
        {props.sessionName}
      </Typography>
      <EditMenu menuPos={menuPos} handleEdit={handleEdit} handleClose={handleClose} />
    </Paper>
  );
};
