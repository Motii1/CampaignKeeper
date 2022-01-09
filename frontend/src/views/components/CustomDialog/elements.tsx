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
    <ArrowBack />
    <Typography variant="h6">{'BACK'}</Typography>
  </Stack>
);

type CustomDialogTitleProps = {
  title: string;
};

export const CustomDialogTitle: React.FC<CustomDialogTitleProps> = props => (
  <Typography variant="h4" sx={{ color: 'customColors.gold', fontWeight: 'bold' }}>
    {props.title}
  </Typography>
);
