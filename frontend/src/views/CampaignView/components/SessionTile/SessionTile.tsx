import { Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../../types/types';
import { EditMenu } from '../../../components/EditMenu/EditMenu';
import { setSessionId as setSessionIdExplorer } from '../../../ExplorerView/explorerViewSlice';
import { resetState as resetEventsState } from '../../../MapView/eventsSlice';
import { setCurrentSession as setSessionMapView } from '../../../MapView/mapViewSlice';
import viewsRoutes from '../../../viewsRoutes';
import { updateState as updateStateCampaign } from '../../campaignViewSlice';

type SessionTileProps = {
  sessionId: string;
  sessionName: string;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

/**
 * Component used to display single session to user, opens said session in MapView (graph)
 * on click and allows to edit session name on context menu (via CampaignDialog).
 * Takes session id and its name as arguments alongside functions responsible for opening
 * CampaignDialog in "edit session" mode
 * @param props
 * @returns
 */
export const SessionTile: React.FC<SessionTileProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

  const handleClick = () => {
    dispatch(
      setSessionMapView({
        currentSessionId: props.sessionId,
        currentSessionTitle: props.sessionName,
      })
    );
    dispatch(setSessionIdExplorer({ currentSessionId: props.sessionId }));
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
      elevation={0}
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
      onContextMenu={handleContextMenu}
    >
      <Typography
        onClick={handleClick}
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
