import { Stack, Typography } from '@mui/material';

export const AboutDialogContent: React.FC = () => (
  <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
    <Typography variant="h6">ABOUT</Typography>
    <Typography variant="subtitle2">
      Version:
      <br />• Eden Prime
    </Typography>
    <Typography variant="subtitle2">
      Authors:
      <br />• Dawid Motak
      <br />• Przemysław Stasiuk
      <br />• Michał Wójtowicz
    </Typography>
  </Stack>
);
