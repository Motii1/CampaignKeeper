import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    customColors: {
      gold: '#FFE082',
    },
    customBackgrounds: {
      lightGray: '#2B3D49',
      textField: '#3C4C57',
    },
    background: {
      default: '#262E38',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
});

declare module '@mui/material/styles' {
  interface PaletteOptions {
    customColors?: {
      gold?: string;
    };
    customBackgrounds?: {
      lightGray?: string;
      textField?: string;
    };
  }
}
