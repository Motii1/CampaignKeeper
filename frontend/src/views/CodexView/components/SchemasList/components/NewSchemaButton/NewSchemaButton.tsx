import { Add } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, Typography } from '@mui/material';

type NewSchemaButtonProps = {
  setIsOpen: (newIsOpen: boolean) => void;
};

/**
 * Button responsible for opening NewSchemaDialog in which user can create new schema
 * @returns
 */
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
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 20,
        margin: 1,
        minHeight: 40,
        height: 40,
        backgroundColor: 'customPalette.accent',
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
