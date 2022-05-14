import { Add } from '@mui/icons-material';
import { Stack, TextField, Typography } from '@mui/material';

type FieldTextAreaProps = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrentField: (newField: string) => void;
  setIsAddDialogOpen: (newIsOpen: boolean) => void;
};

export const FieldTextArea: React.FC<FieldTextAreaProps> = props => (
  <Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="stretch"
    spacing={0}
    sx={{ width: '100%' }}
  >
    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={0.5}>
      <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
        {props.name}
      </Typography>
      <Add
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          props.setCurrentField(props.name);
          props.setIsAddDialogOpen(true);
        }}
      />
    </Stack>
    <TextField
      value={props.value}
      size="small"
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
      multiline
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
