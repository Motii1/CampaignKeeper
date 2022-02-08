import { Stack, TextField, Typography } from '@mui/material';

export type LabeledInputProps = {
  text: string;
  placeholder: string;
  defaultValue?: string;
  helperText: null | string;
  defaultHelperText: string;
  isPassword?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

export const LabeledTextInput: React.FC<LabeledInputProps> = props => (
  <Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="stretch"
    spacing={0}
    sx={{ width: '100%' }}
  >
    <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
      {props.text}
    </Typography>
    <TextField
      size="small"
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
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
      type={props.isPassword ? 'password' : ''}
      onChange={props.onChange}
      onBlur={props.onBlur}
      sx={{
        backgroundColor: props.helperText ? 'customPalette.error' : 'customPalette.background',
        borderRadius: 1,
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

LabeledTextInput.defaultProps = {
  isPassword: false,
} as Partial<LabeledInputProps>;
