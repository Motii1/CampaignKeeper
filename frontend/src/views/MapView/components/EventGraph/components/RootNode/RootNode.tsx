import { Paper, Typography } from '@mui/material';

type RootNodeProps = {
  sessionName: string;
};

export const RootNode: React.FC<RootNodeProps> = props => (
  <Paper
    id="root-node"
    elevation={0}
    sx={{
      backgroundColor: 'customPalette.accent',
      borderRadius: 3,
      padding: 0.5,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'customPalette.tertiary',
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: 'customPalette.onSurface',
          fontSize: 20,
          fontWeight: 'bold',
          padding: '5px 14px',
          textTransform: 'uppercase',
        }}
      >
        {props.sessionName}
      </Typography>
    </Paper>
  </Paper>
);
