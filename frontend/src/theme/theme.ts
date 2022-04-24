import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    customPalette: {
      background: '#262E38',
      surface: '#2B3D49',
      primary: '#425C71',
      secondary: '#A5C8E8',
      schemaHeaderColor: '#3B5163', // to rename by Michal
      schemaInstanceColor: '#A5C8E8', // to rename by Michal
      onBackground: '#f4f4f4',
      onSurface: '#ffffff',
      onPrimary: '#ffffff',
      onSecondary: '#2B3D49',
      onSchemaHeaderColor: '#ffffff', // to rename by Michal
      onSchemaInstanceColor: '#000000',
      error: '#604e57',
      onError: '#FF8282',
      accent: '#FFE082',
      onAccent: '#262E38',
      red: '#FF8282',
      onRed: '#262E38',
      brown: '#362C28',
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
  typography: {
    fontFamily: ['Roboto', 'cursive'].join(','),
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
    customPalette?: {
      background?: string;
      surface?: string;
      primary?: string;
      secondary?: string;
      schemaHeaderColor?: string;
      schemaInstanceColor?: string;
      onBackground?: string;
      onSurface?: string;
      onPrimary?: string;
      onSecondary?: string;
      onSchemaHeaderColor?: string;
      onSchemaInstanceColor?: string;
      error?: string;
      onError?: string;
      accent?: string;
      onAccent?: string;
      red?: string;
      onRed?: string;
      brown?: string;
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
