import { Add } from '@mui/icons-material';
import { Paper, Stack, Typography } from '@mui/material';

type NewChildChipProps = {
  setIsOpen: (newIsOpen: boolean) => void;
};

export const NewChildChip: React.FC<NewChildChipProps> = props => {
  const handleClick = () => {
    props.setIsOpen(true);
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderRadius: '18px',
        backgroundColor: 'customPalette.accent',
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        sx={{ padding: '10px 20px 10px 10px' }}
      >
        <Add fontSize="large" sx={{ color: 'customPalette.onAccent' }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'customPalette.onAccent',
          }}
        >
          New event
        </Typography>
      </Stack>
    </Paper>
  );
};
