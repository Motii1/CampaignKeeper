import { Add } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

type FieldChipBarProps = {
  name: string;
  value: string;
  setCurrentField: (newField: string) => void;
  setIsAddDialogOpen: (newIsOpen: boolean) => void;
};

export const FieldChipBar: React.FC<FieldChipBarProps> = props => (
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
