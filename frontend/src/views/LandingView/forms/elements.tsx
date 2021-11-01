import { Box, Button, TextField, Typography } from '@mui/material';

type HeaderProps = {
  text: string;
};

type InputProps = {
  text: string;
  id: string;
  placeholder: string;
};

type ButtonProps = {
  text: string;
};

type ChangeProps = {
  firstLineText: string;
  secondLineText: string;
  buttonText: string;
};

export const FormHeader: React.FC<HeaderProps> = props => (
  <Typography variant="h4" sx={{ color: 'primary.main' }}>
    <b>{props.text}</b>
  </Typography>
);

export const LabeledTextInput: React.FC<InputProps> = pros => (
  <Box sx={{ padding: '10px 0px' }}>
    <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
      <b>{pros.text}</b>
    </Typography>
    <TextField
      required
      id={pros.id}
      placeholder={pros.placeholder}
      variant="outlined"
      fullWidth
      sx={{ backgroundColor: 'background.paper', color: 'common.white' }}
    />
  </Box>
);

export const LabeledPasswordInput: React.FC<InputProps> = pros => (
  <Box sx={{ padding: '10px 0px' }}>
    <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
      <b>{pros.text}</b>
    </Typography>
    <TextField
      required
      id={pros.id}
      placeholder={pros.placeholder}
      type="password"
      variant="outlined"
      fullWidth
      sx={{ backgroundColor: 'background.paper' }}
    />
  </Box>
);

export const StandardButton: React.FC<ButtonProps> = props => (
  <Button variant="contained">{props.text}</Button>
);

export const ChangeFormComponent: React.FC<ChangeProps> = props => (
  <Box sx={{ position: 'relative', right: '0px' }}>
    <Typography variant="subtitle2" sx={{ color: 'common.white', textAlign: 'right' }}>
      {props.firstLineText}
      <br />
      {props.secondLineText}
    </Typography>
    <Button variant="contained" sx={{ float: 'right' }}>
      {props.buttonText}
    </Button>
  </Box>
);
