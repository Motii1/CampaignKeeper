import { Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavBarViewDialog } from '../../../../types/types';
import { EditMenu } from '../../../components/EditMenu/EditMenu';
import { updateState } from '../../campaignViewSlice';

type SessionTileProps = {
  sessionId: number;
  sessionTitle: string;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const SessionTile: React.FC<SessionTileProps> = props => {
  const dispatch = useDispatch();
  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

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
    dispatch(updateState({ name: props.sessionTitle }));
    props.setIsOpen(true);
    props.setDialogType(NavBarViewDialog.EditSession);
    setMenuPos(null);
  };

  return (
    <Paper
      sx={{
        cursor: 'context-menu',
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
        sx={{
          color: 'customPalette.onSurface',
          fontWeight: 'medium',
          textAlign: 'left',
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingTop: 1.0,
        }}
      >
        {props.sessionTitle}
      </Typography>
      <EditMenu menuPos={menuPos} handleEdit={handleEdit} handleClose={handleClose} />
    </Paper>
  );
};
