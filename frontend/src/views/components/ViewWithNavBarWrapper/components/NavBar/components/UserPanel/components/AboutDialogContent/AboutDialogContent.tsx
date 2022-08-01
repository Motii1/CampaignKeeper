import { Stack, Typography } from '@mui/material';

/**
 * Dialog which shows basic information about application (version and authors)
 * @returns
 */
export const AboutDialogContent: React.FC = () => (
  <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
    <Typography variant="subtitle2">
      Version:
      <br />• Terra Nova
    </Typography>
    <Typography variant="subtitle2">
      Authors:
      <br />• Dawid Motak
      <br />• Przemysław Stasiuk
      <br />• Michał Wójtowicz
    </Typography>
  </Stack>
);
