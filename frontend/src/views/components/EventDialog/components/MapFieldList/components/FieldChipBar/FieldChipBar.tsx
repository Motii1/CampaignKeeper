import { Add } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

type FieldChipBarProps = {
  name: string;
  value: string;
  setCurrentField: (newField: string) => void;
  setIsAddDialogOpen: (newIsOpen: boolean) => void;
};

/**
 * Component used to display name of Places and Characters fields
 * and open dialog which allows to add more references to them
 * @param props
 * @returns
 */
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
