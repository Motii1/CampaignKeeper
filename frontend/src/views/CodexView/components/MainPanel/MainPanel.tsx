import { Paper, Stack, Typography } from '@mui/material';

type MainPanelProps = {
  title: string;
};

// TO-DO add method for creating SchemaInstance and SchemaIstance React.FC
// TO-DO add scroll for long list of objects
export const MainPanel: React.FC<MainPanelProps> = props => (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: 'customPalette.surface',
      width: '100%',
      height: '100%',
    }}
  >
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
      sx={{ margin: '20px' }}
    >
      <Typography variant={'h4'} sx={{ color: 'customPalette.accent' }}>
        {props.title}
      </Typography>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        <Typography
          variant={'subtitle1'}
          sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}
        >
          {'NPC 1'}
        </Typography>
        <Typography
          variant={'subtitle1'}
          sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}
        >
          {'NPC 2'}
        </Typography>
        <Typography
          variant={'subtitle1'}
          sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}
        >
          {'NPC 3'}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);
