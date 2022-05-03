import { Stack, TextField, Typography } from '@mui/material';

type FieldTextAreaProps = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FieldTextArea: React.FC<FieldTextAreaProps> = props => (
  <Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="stretch"
    spacing={0}
    sx={{ width: '100%' }}
  >
    <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
      {props.name}
    </Typography>
    <TextField
      value={props.value}
      size="medium"
      inputProps={{
        sx: {
          '&::placeholder': {
            color: 'customPalette.onBackground',
            opacity: 0.6,
          },
          '&::-ms-reveal': {
            filter: 'invert(100%)',
          },
          '&': {
            fontSize: 16,
            fontWeight: 'light',
          },
        },
      }}
      variant="outlined"
      fullWidth
      onChange={props.onChange}
      sx={{
        backgroundColor: 'customPalette.background',
        borderRadius: 1,
        '& .MuiInputBase-root': {
          color: 'customPalette.onBackground',
          opacity: 1,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
        },
      }}
    />
  </Stack>
);
