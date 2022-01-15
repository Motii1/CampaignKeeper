import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

type ReturnBarProps = {
  setOpen: (newState: boolean) => void;
};

export const ReturnBar: React.FC<ReturnBarProps> = props => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={2}
    onClick={() => props.setOpen(false)}
  >
    <ArrowBack sx={{ color: 'customPalette.onSurface', opacity: 0.8 }} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 'regular', color: 'customPalette.onSurface', opacity: 0.8 }}
    >
      {'BACK'}
    </Typography>
  </Stack>
);

type CustomDialogTitleProps = {
  title: string;
};

export const CustomDialogTitle: React.FC<CustomDialogTitleProps> = props => (
  <Typography
    variant="h4"
    sx={{
      color: 'customPalette.accent',
      fontWeight: 'bold',
      letterSpacing: 0.5,
      paddingTop: 1,
    }}
  >
    {props.title}
  </Typography>
);
