import { CircularProgress, Stack } from '@mui/material';

/**
 * Component serving as unified loading animation in form of spinning circle
 * @returns
 */
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
