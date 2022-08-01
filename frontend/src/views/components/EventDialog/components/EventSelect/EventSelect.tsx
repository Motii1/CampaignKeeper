import { MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { CustomSelect } from '../../../CustomSelect/CustomSelect';

type EventSelectProps = {
  id: string;
  title: string;
  value: string;
  setValue: (newValue: string) => void;
  items: string[];
};

/**
 * Select used for selecting event type and status in EventDialog
 * @param props
 * @returns
 */
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
        value={props.value}
        handleChange={handleChange}
        renderValue={renderValue}
      >
        {renderItems()}
      </CustomSelect>
    </Stack>
  );
};
