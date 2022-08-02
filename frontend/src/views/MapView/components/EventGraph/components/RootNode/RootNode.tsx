import { Paper, Typography } from '@mui/material';

type RootNodeProps = {
  sessionName: string;
};

/**
 * Component serving as "root" of EventGraph, displays name of session
 * from which graph has been built.
 * NOTE: while the actual root of graph is an event (withouth any parents),
 * this components is important as it shows session name to user
 * @param props
 * @returns
 */
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
