import { Stack, TextField, Typography } from '@mui/material';
import { LabeledInputProps } from '../LabeledTextInput/LabeledTextInput';

export const LabeledPasswordInput: React.FC<LabeledInputProps> = props => (
  <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0}>
    <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
      {props.text}
    </Typography>
    <TextField
      id={props.id}
      placeholder={props.placeholder}
      fullWidth
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
            height: 7,
            fontSize: 16,
            fontWeight: 'light',
          },
        },
      }}
      type="password"
      variant="outlined"
      onChange={props.onChange}
      onBlur={props.onBlur}
      sx={{
        backgroundColor: props.helperText ? 'customPalette.error' : 'customPalette.background',
        borderRadius: 2,
        '& .MuiInputBase-root': {
          color: 'customPalette.onBackground',
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
        '& .MuiOutlinedInput-input': {
          color: 'customPalette.onBackground',
        },
      }}
    />
    <Typography
      variant="subtitle2"
      sx={{
        color: props.helperText ? 'customPalette.onError' : 'customPalette.onBackground',
        paddingLeft: 1,
        paddingBottom: 0.5,
        paddingTop: 0.5,
        display: 'block',
        fontStyle: 'italic',
        height: 18,
      }}
    >
      {props.helperText ?? props.defaultHelperText}
    </Typography>
  </Stack>
);
