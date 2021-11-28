import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    customColors: {
      gold: '#FFE082',
    },
    customBackgrounds: {
      ligthGray: '#3B5163',
      gray: '#2B3D49',
      textField: '#3C4C57',
    },
    background: {
      default: '#262E38',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
  dimensions: {
    navBarHeight: 50,
    navBarExpandedHeight: 60,
    navBarLogoHeight: 100,
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    dimensions: {
      navBarHeight: number;
      navBarExpandedHeight: number;
      navBarLogoHeight: number;
    };
  }
  interface PaletteOptions {
    customColors?: {
      gold?: string;
    };
    customBackgrounds?: {
      ligthGray?: string;
      gray?: string;
      textField?: string;
    };
  }
  interface ThemeOptions {
    dimensions?: {
      navBarHeight?: number;
      navBarExpandedHeight?: number;
      navBarLogoHeight?: number;
    };
  }
}
