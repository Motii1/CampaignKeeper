import { CircularProgress, Stack } from '@mui/material';

export const CircleProgress: React.FC = () => (
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
);
