import { Paper, Typography } from '@mui/material';

export const SchemasListHeader: React.FC = () => (
  <Paper
    square
    sx={{
      backgroundColor: 'customPalette.schemaHeaderColor',
      height: 100,
      width: 250,
      position: 'relative',
    }}
  >
    <Typography
      sx={{
        color: 'customPalette.onSchemaHeaderColor',
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