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
    spacing={1.8}
    onClick={() => props.setOpen(false)}
  >
    <ArrowBack sx={{ color: 'customPalette.onSurface', opacity: 0.8 }} />
    <Typography
      variant="h6"
      sx={{
        paddingTop: 0.2,
        fontSize: 18,
        fontWeight: 'regular',
        color: 'customPalette.onSurface',
        opacity: 0.8,
      }}
    >
      {'BACK'}
    </Typography>
  </Stack>
);
