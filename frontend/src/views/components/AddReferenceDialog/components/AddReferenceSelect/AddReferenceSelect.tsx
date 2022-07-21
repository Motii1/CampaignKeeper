import { MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { CustomSelect } from '../../../CustomSelect/CustomSelect';
import { ReferenceSelectItem } from '../../AddReferenceDialog';

type AddReferenceSelectProps = {
  name: string;
  id: string;
  label: string;
  value: ReferenceSelectItem | null;
  setValue: (newValue: ReferenceSelectItem | null) => void;
  items: ReferenceSelectItem[] | null;
};

export const AddReferenceSelect: React.FC<AddReferenceSelectProps> = props => {
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
      <CustomSelect
        labelId={props.id}
        handleChange={handleChange}
        value={props.value?.id}
        renderValue={renderValue}
      >
        {renderItems()}
      </CustomSelect>
    </Stack>
  );
};
