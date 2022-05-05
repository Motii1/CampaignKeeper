import { Add } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, Typography } from '@mui/material';

type NewSchemaButtonProps = {
  setIsOpen: (newIsOpen: boolean) => void;
};

const ButtonContent: React.FC = () => (
  <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
    <Add />
    <Typography
      sx={{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 0.5,
        paddingBottom: 0.5,
      }}
    >
      New schema
    </Typography>
  </Stack>
);

export const NewSchemaButton: React.FC<NewSchemaButtonProps> = props => {
  const onClick = () => props.setIsOpen(true);

  return (
    <Paper
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 20,
        height: 40,
        backgroundColor: 'customPalette.accent',
        position: 'absolute',
        bottom: 10,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        color: 'customPalette.onAccent',
      }}
    >
      <ButtonBase sx={{ paddingLeft: 1.2, paddingRight: 1.9, textTransform: 'uppercase' }}>
        <ButtonContent />
      </ButtonBase>
    </Paper>
  );
};
