import { CircularProgress, Paper, Stack } from '@mui/material';

/**
 * Component shown when an operation is being performed
 * and application waits for data to display proper view
 * @returns
 */
export const LoadingView: React.FC = () => (
  <Paper
    square
    sx={{
      height: '100vh',
      width: '100%',
      backgroundColor: 'customPalette.background',
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={0}
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress size={35} thickness={6} sx={{ color: 'customPalette.accent' }} />
    </Stack>
  </Paper>
);
