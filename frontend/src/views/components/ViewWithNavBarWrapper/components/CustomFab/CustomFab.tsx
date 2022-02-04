import { Fab } from '@mui/material';
import React from 'react';

type CustomFabProps = {
  text?: string;
};

export const CustomFab: React.FC<CustomFabProps> = props => (
  <Fab
    variant="extended"
    sx={{
      color: 'customPalette.onAccent',
      backgroundColor: 'customPalette.accent',
      position: 'absolute',
      bottom: '2vh',
      right: '2vh',
      '&.MuiButtonBase-root:hover': {
        bgcolor: 'customPalette.accent',
      },
    }}
  >
    {props.children}
  </Fab>
);
