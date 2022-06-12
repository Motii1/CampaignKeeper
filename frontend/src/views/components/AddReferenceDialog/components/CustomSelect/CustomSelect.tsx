import { FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { ReferenceSelectItem } from '../../AddReferenceDialog';

type CustomSelectProps = {
  name: string;
  id: string;
  label: string;
  setValue: (newValue: ReferenceSelectItem | null) => void;
  items: ReferenceSelectItem[] | null;
};

// IMPORTANT: MenuItems need css uplift
export const CustomSelect: React.FC<CustomSelectProps> = props => {
  const handleChange = (event: SelectChangeEvent) => {
    if (props.items) {
      const newValue = props.items.find(item => item.id === event.target.value);
      props.setValue(newValue ? newValue : null);
    }
  };

  const renderValue = (value: string) =>
    props?.items?.find(item => item.id === value)?.name ?? props.label;

  const renderItems = () =>
    props.items
      ? props.items.map(item => (
          <MenuItem
            key={item.id}
            value={item.id}
            sx={{
              color: 'customPalette.onBackground',
              backgroundColor: 'customPalette.background',
            }}
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
      <Typography
        sx={{
          color: 'customPalette.onSurface',
          fontWeight: 'normal',
          fontSize: 18,
          paddingLeft: 0.9,
        }}
      >
        {props.name}
      </Typography>
      <FormControl fullWidth>
        <Select
          labelId={props.id}
          onChange={handleChange}
          defaultValue={''}
          size="small"
          variant="outlined"
          displayEmpty
          renderValue={renderValue}
          MenuProps={{
            variant: 'menu',
            sx: {
              '& .MuiMenu-paper': {
                backgroundColor: 'customPalette.background',
                marginTop: '-2px',
                marginRight: '1px',
                borderRadius: '0px 0px 5px 5px',
                boxShadow: 'none',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '& .MuiSelect-outlined': {
              color: 'customPalette.onBackground',
              backgroundColor: 'customPalette.background',
              borderInlineColor: 'transparent',
              borderRadius: 1,
            },
            '& .MuiSelect-icon': {
              color: 'customPalette.onBackground',
            },
          }}
        >
          {renderItems()}
        </Select>
      </FormControl>
    </Stack>
  );
};
