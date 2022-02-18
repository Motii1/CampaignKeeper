import { Paper, Typography } from '@mui/material';

type SessionTileProps = {
  sessionTitle: string;
};

//TO-DO this component should take image as one of args -> add after API finished
export const SessionTile: React.FC<SessionTileProps> = props => (
  <Paper
    sx={{
      cursor: 'context-menu',
      borderRadius: 2.5,
      backgroundColor: 'customPalette.surface',
      height: 40,
      width: 371.2,
      padding: 0.66,
      margin: 1.5,
    }}
    //onContextMenu={handleContextMenu}
  >
    <Typography
      sx={{
        color: 'customPalette.onSurface',
        fontWeight: 'medium',
        textAlign: 'left',
        paddingLeft: 1.5,
        paddingRight: 1.5,
        paddingTop: 0.3,
      }}
    >
      {props.sessionTitle}
    </Typography>
  </Paper>
);
