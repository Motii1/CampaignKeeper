import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SelectItem } from '../../AddReferenceDialog';

type CustomSelectProps = {
  id: string;
  label: string;
  setValue: (newValue: SelectItem | null) => void;
  items: SelectItem[] | null;
};

export const CustomSelect: React.FC<CustomSelectProps> = props => {
  const handleChange = (event: SelectChangeEvent) => {
    if (props.items) {
      const newValue = props.items.find(item => item.id === event.target.value);
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
    <FormControl fullWidth>
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select labelId={props.id} label={props.label} onChange={handleChange}>
        {renderItems()}
      </Select>
    </FormControl>
  );
};
