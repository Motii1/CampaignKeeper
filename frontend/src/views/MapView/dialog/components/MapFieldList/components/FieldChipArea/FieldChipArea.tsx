import { Add } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

type FieldChipAreaProps = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrentField: (newField: string) => void;
  setIsAddDialogOpen: (newIsOpen: boolean) => void;
};

export const FieldChipArea: React.FC<FieldChipAreaProps> = props => (
  <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={0.5}>
    <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
      {props.name}
    </Typography>
    <Add
      sx={{ cursor: 'pointer', color: 'customPalette.onSurface' }}
      onClick={() => {
        props.setCurrentField(props.name);
        props.setIsAddDialogOpen(true);
      }}
    />
  </Stack>
);
