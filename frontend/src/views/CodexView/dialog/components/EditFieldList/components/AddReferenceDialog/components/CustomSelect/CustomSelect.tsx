import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { SelectItem } from '../../AddReferenceDialog';

type CustomSelectProps = {
  name: string;
  id: string;
  label: string;
  setValue: (newValue: SelectItem | null) => void;
  items: SelectItem[] | null;
};

// IMPORTANT: MenuItems need css uplift
export const CustomSelect: React.FC<CustomSelectProps> = props => {
  const handleChange = (event: SelectChangeEvent) => {
    if (props.items) {
      const newValue = props.items.find(item => item.id === event.target.value);
      // eslint-disable-next-line no-console
      console.log(event.target.value);
      props.setValue(newValue ? newValue : null);
    }
  };

  const renderItems = () =>
    props.items
      ? props.items.map(item => (
          <MenuItem
            key={item.id}
            value={item.id}
            sx={{ color: 'customPalette.onSurface', backgroundColor: 'customPalette.surface' }}
          >
            {item.name}
          </MenuItem>
        ))
      : null;

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={0.5}
      sx={{ width: '100%' }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {props.name}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id={props.id}>{props.label}</InputLabel>
        <Select labelId={props.id} label={props.label} onChange={handleChange} defaultValue={''}>
          {renderItems()}
        </Select>
      </FormControl>
    </Stack>
  );
};
