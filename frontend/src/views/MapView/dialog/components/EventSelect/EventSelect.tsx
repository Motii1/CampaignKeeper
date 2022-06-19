import { MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { CustomSelect } from '../../../../components/CustomSelect/CustomSelect';

type EventSelectProps = {
  id: string;
  title: string;
  setValue: (newValue: string) => void;
  items: string[];
  defaultValue?: string;
};

export const EventSelect: React.FC<EventSelectProps> = props => {
  const handleChange = (event: SelectChangeEvent) => {
    props.setValue(event.target.value);
  };

  const renderValue = (value: string) => value;

  const renderItems = () =>
    props.items.map(item => (
      <MenuItem value={item} key={item}>
        {item}
      </MenuItem>
    ));

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={0.5}
      sx={{ width: '100%' }}
    >
      <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
        {props.title}
      </Typography>
      <CustomSelect
        labelId={props.id}
        handleChange={handleChange}
        renderValue={renderValue}
        defaultValue={props.defaultValue}
      >
        {renderItems()}
      </CustomSelect>
    </Stack>
  );
};
