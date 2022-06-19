import { Paper, Typography } from '@mui/material';

export const RootNode: React.FC = () => (
  <Paper id="root-node" elevation={24} sx={{ backgroundColor: 'customPalette.accent' }}>
    <Typography
      variant="h4"
      sx={{ color: 'customPalette.onAccent', fontWeight: 'bold', padding: '10px' }}
    >
      START
    </Typography>
  </Paper>
);
