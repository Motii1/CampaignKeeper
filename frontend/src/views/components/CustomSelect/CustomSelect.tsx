import { FormControl, Select, SelectChangeEvent } from '@mui/material';
import { ReactNode } from 'react';

type CustomSelectProps = {
  labelId: string;
  value?: string;
  handleChange: (event: SelectChangeEvent) => void;
  renderValue: (value: string) => ReactNode;
};

/**
 * Standard MUI Select with styling and props allowing its control from parent component
 * @param props
 * @returns
 */
export const CustomSelect: React.FC<CustomSelectProps> = props => (
  <FormControl fullWidth>
    <Select
      labelId={props.labelId}
      onChange={props.handleChange}
      value={props.value ?? ''}
      size="small"
      variant="outlined"
      displayEmpty
      renderValue={props.renderValue}
      MenuProps={{
        variant: 'menu',
        sx: {
          '& .MuiMenu-paper': {
            backgroundColor: 'customPalette.background',
            marginTop: 0.5,
            marginRight: '1px',
            borderRadius: '5px',
            boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
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
        textTransform: 'capitalize',
      }}
    >
      {props.children}
    </Select>
  </FormControl>
);
