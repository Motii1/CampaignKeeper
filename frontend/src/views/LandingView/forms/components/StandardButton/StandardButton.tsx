import { Button } from '@mui/material';

type StandardButtonProps = {
  text: string;
};

// IMPORTANT: this button will be probably reused a lot in project and will be moved to /src/views/components in near future
export const StandardButton: React.FC<StandardButtonProps> = props => (
  <Button
    variant="contained"
    type="submit"
    sx={{
      color: 'customPalette.onAccent',
      paddingLeft: 1.2,
      paddingRight: 1.2,
      paddingTop: 0.5,
      paddingBottom: 0.3,
      fontWeight: 'bold',
      backgroundColor: 'customPalette.accent',
      '&.MuiButtonBase-root:hover': {
        bgcolor: 'customPalette.accent',
      },
    }}
  >
    <b>{props.text}</b>
  </Button>
);
