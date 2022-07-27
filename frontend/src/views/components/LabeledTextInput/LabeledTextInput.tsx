import { Stack, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export type LabeledInputProps = {
  text: string;
  value?: string;
  placeholder: string;
  defaultValue?: string;
  helperText: null | string;
  defaultHelperText: string;
  isPassword?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

/**
 * Component used as TextField input with label (title), actual input,
 * validation mechanism and helper text which can display default text (default color,
 * e.g. explaining password requirements) or alert text (alert color,
 * e.g. informing that password doesn't meet requirements)
 * @param props
 * @returns
 */
export const LabeledTextInput: React.FC<LabeledInputProps> = props => {
  const { isLight } = useSelector((state: RootState) => state.theme);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={0}
      sx={{ width: '100%' }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: 'customPalette.onSurface',
          paddingLeft: 1,
        }}
      >
        {props.text}
      </Typography>
      <TextField
        value={props.value}
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
              filter: isLight ? 'invert(0%)' : 'invert(100%)',
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
          color: props.helperText ? 'customPalette.red' : 'customPalette.onBackground',
          opacity: props.helperText ? 1 : 0.75,
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
};

LabeledTextInput.defaultProps = {
  isPassword: false,
} as Partial<LabeledInputProps>;
