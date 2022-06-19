import { Stack, Typography } from '@mui/material';

type EventDetailsFieldProps = {
  title: string;
};

export const EventDetailsField: React.FC<EventDetailsFieldProps> = props => (
  <Stack direction="column" justifyContent="center" alignItems="center" spacing={0.5}>
    <Typography variant="subtitle2" sx={{ color: 'customPalette.accent', textAlign: 'left' }}>
      {props.title}
    </Typography>
    {props.children}
  </Stack>
);
