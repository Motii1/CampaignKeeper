import { FormControl, Select, SelectChangeEvent } from '@mui/material';
import { ReactNode } from 'react';

type CustomSelectProps = {
  labelId: string;
  defaultValue?: string;
  handleChange: (event: SelectChangeEvent) => void;
  renderValue: (value: string) => ReactNode;
};

export const CustomSelect: React.FC<CustomSelectProps> = props => (
  <FormControl fullWidth>
    <Select
      labelId={props.labelId}
      onChange={props.handleChange}
      defaultValue={props.defaultValue ?? ''}
      size="small"
      variant="outlined"
      displayEmpty
      renderValue={props.renderValue}
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
      {props.children}
    </Select>
  </FormControl>
);
