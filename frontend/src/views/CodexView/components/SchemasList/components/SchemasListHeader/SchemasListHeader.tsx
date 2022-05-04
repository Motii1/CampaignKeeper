import { Paper, Typography } from '@mui/material';

export const SchemasListHeader: React.FC = () => (
  <Paper
    square
    sx={{
      backgroundColor: 'customPalette.primary',
      height: 100,
      width: 220,
      position: 'relative',
    }}
  >
    <Typography
      sx={{
        color: 'customPalette.onPrimary',
        fontWeight: 'bold',
        position: 'absolute',
        left: 10,
        bottom: 10,
      }}
    >
      SCHEMAS
    </Typography>
  </Paper>
);
