import { Button, Stack, TextField, Typography } from '@mui/material';

type InputProps = {
  text: string;
  id: string;
  placeholder: string;
  helperText: null | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

type ButtonProps = {
  text: string;
};

type ChangeProps = {
  firstLineText: string;
  secondLineText: string;
  buttonText: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const LabeledTextInput: React.FC<InputProps> = props => (
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
        color: 'customPalette.onError',
        paddingLeft: 1,
        paddingBottom: 0.5,
        paddingTop: 0.5,
        display: 'block',
        fontStyle: 'italic',
        height: 18,
      }}
    >
      {props.helperText ?? ''}
    </Typography>
  </Stack>
);

export const LabeledPasswordInput: React.FC<InputProps> = props => (
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
        color: 'customPalette.onError',
        paddingLeft: 1,
        paddingBottom: 0.5,
        paddingTop: 0.5,
        display: 'block',
        fontStyle: 'italic',
        height: 18,
      }}
    >
      {props.helperText ?? ''}
    </Typography>
  </Stack>
);

export const StandardButton: React.FC<ButtonProps> = props => (
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

export const ChangeFormComponent: React.FC<ChangeProps> = props => (
  <Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-end"
    spacing={0.5}
    onSubmit={props.onSubmit}
    component="form"
    sx={{ width: '100%' }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        color: 'customPalette.onSurface',
        textAlign: 'right',
        fontWeight: 'regular',
      }}
    >
      {props.firstLineText}
      <br />
      {props.secondLineText}
    </Typography>
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
      {props.buttonText}
    </Button>
  </Stack>
);
