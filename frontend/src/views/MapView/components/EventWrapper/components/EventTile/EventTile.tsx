import { Paper, Typography } from '@mui/material';

type EventTileProps = {
  id: string;
  title: string;
};

export const EventTile: React.FC<EventTileProps> = props => (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: 'customPalette.accent',
      width: '300px',
      height: '100px',
      '& .MuiBox-root': {
        '& .css-0': {
          zIndex: '5',
        },
      },
    }}
    id={props.id}
  >
    <Typography sx={{ fontWeight: 'bold', color: 'customPalette.onAccent', textAlign: 'center' }}>
      {props.title}
    </Typography>
  </Paper>
);
