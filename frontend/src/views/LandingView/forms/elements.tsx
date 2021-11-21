import { Button, Stack, TextField, Typography } from '@mui/material';

type HeaderProps = {
  text: string;
};

type InputProps = {
  text: string;
  id: string;
  placeholder: string;
  helperText: null | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

export const FormHeader: React.FC<HeaderProps> = props => (
  <Typography variant="h4" sx={{ color: 'customColors.gold' }}>
    <b>{props.text}</b>
  </Typography>
);

export const LabeledTextInput: React.FC<InputProps> = props => (
  <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0.5}>
    <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
      <b>{props.text}</b>
    </Typography>
    <TextField
      required
      id={props.id}
      placeholder={props.placeholder}
      variant="outlined"
      fullWidth
      onChange={props.onChange}
      sx={{ backgroundColor: 'customBackgrounds.textField', color: 'common.white' }}
    />
    <Typography
      variant="subtitle2"
      sx={{
        color: 'common.white',
        marginLeft: '10px',
        display: `${props.helperText ? 'block' : 'none'}`,
      }}
    >
      <i>{props.helperText}</i>
    </Typography>
  </Stack>
);

export const LabeledPasswordInput: React.FC<InputProps> = props => (
  <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0.5}>
    <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
      <b>{props.text}</b>
    </Typography>
    <TextField
      required
      id={props.id}
      placeholder={props.placeholder}
      type="password"
      variant="outlined"
      fullWidth
      onChange={props.onChange}
      sx={{ backgroundColor: 'customBackgrounds.textField' }}
    />
    <Typography
      variant="subtitle2"
      sx={{
        color: 'common.white',
        marginLeft: '10px',
        display: `${props.helperText ? 'block' : 'none'}`,
      }}
    >
      <i>{props.helperText}</i>
    </Typography>
  </Stack>
);

export const StandardButton: React.FC<ButtonProps> = props => (
  <Button
    variant="contained"
    type="submit"
    sx={{
      marginTop: '10px',
      width: '30%',
      minWidth: '100px',
      color: 'common.black',
      backgroundColor: 'customColors.gold',
      '&.MuiButtonBase-root:hover': {
        bgcolor: 'customColors.gold',
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
    <Typography variant="subtitle2" sx={{ color: 'common.white', textAlign: 'right' }}>
      {props.firstLineText}
      <br />
      {props.secondLineText}
    </Typography>
    <Button
      variant="contained"
      type="submit"
      sx={{
        color: 'common.black',
        backgroundColor: 'customColors.gold',
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'customColors.gold',
        },
      }}
    >
      <b>{props.buttonText}</b>
    </Button>
  </Stack>
);
