import { Stack, TextField, Typography } from '@mui/material';

export type LabeledInputProps = {
  text: string;
  id: string;
  placeholder: string;
  helperText: null | string;
  defaultHelperText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

export const LabeledTextInput: React.FC<LabeledInputProps> = props => (
  <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0}>
    <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
      {props.text}
    </Typography>
    <TextField
      id={props.id}
      placeholder={props.placeholder}
      inputProps={{
        sx: {
          '&::placeholder': {
            color: 'customPalette.onBackground',
            opacity: 0.6,
          },
          '&': {
            borderRadius: 2,
            height: 7,
            fontSize: 16,
            fontWeight: 'light',
          },
        },
      }}
      variant="outlined"
      fullWidth
      onChange={props.onChange}
      onBlur={props.onBlur}
      sx={{
        backgroundColor: props.helperText ? 'customPalette.error' : 'customPalette.background',
        borderRadius: 2,
        '& .MuiInputBase-root': {
          color: props.helperText ? 'customPalette.onError' : 'customPalette.onBackground',
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
