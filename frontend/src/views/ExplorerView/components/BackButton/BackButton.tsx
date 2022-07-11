import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab, Typography } from '@mui/material';

type BackButtonProps = {
  handleClick: () => void;
};

export const BackButton: React.FC<BackButtonProps> = props => (
  <Fab
    variant="extended"
    aria-label="back-fab"
    onClick={props.handleClick}
    sx={{
      color: 'customPalette.onAccent',
      backgroundColor: 'customPalette.accent',
      boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
      position: 'fixed',
      top: 120,
      left: 120,
      '&.MuiButtonBase-root:hover': {
        bgcolor: 'customPalette.accent',
      },
      '&.MuiFab-extended:focus': {
        boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
      },
    }}
  >
    <ArrowBackIcon />
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
      BACK
    </Typography>
  </Fab>
);
