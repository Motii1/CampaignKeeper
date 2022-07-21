import { Paper, Typography } from '@mui/material';

export const SchemasListHeader: React.FC = () => (
  <Paper
    elevation={0}
    square
    sx={{
      backgroundColor: 'transparent',
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
        opacity: 0.7,
      }}
    >
      SCHEMAS
    </Typography>
  </Paper>
);
