import { Paper, Typography } from '@mui/material';

export const SchemasListHeader: React.FC = () => (
  <Paper
    square
    sx={{
      backgroundColor: 'customPalette.primary',
      minHeight: 100,
      height: 100,
      width: 220,
      display: 'flex',
      alignItems: 'end',
    }}
  >
    <Typography
      sx={{
        color: 'customPalette.onPrimary',
        fontWeight: 'bold',
        marginLeft: 2,
        marginBottom: 1,
      }}
    >
      SCHEMAS
    </Typography>
  </Paper>
);
