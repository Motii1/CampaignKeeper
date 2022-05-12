import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            width: '26px',
          },
          '&::-webkit-scrollbar-track': {
            margin: 0.1,
          },
          '&::-webkit-scrollbar-thumb': {
            boxShadow: 'inset 0 0 10px 10px #ffffffaa',
            border: 'solid 10px transparent',
            borderRadius: '20px',
            minHeight: '40px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            boxShadow: 'inset 0 0 10px 10px #ffffffdd',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#15191f',
          fontWeight: 500,
          fontFamily: ['Roboto', 'cursive'].join(','),
        },
      },
    },
  },
  palette: {
    customPalette: {
      background: '#ecf8ff',
      surface: '#d0e6fc',
      primary: '#e4f2ff',
      secondary: '#9eefe2',
      onBackground: '#303d50',
      onBackgroundSpecial: '#303d50',
      onSurface: '#262E38',
      onPrimary: '#262E38',
      onSecondary: '#242424',
      error: '#604e57',
      onError: '#FF8282',
      accent: '#facf48',
      onAccent: '#242424',
      red: '#FF8282',
      onRed: '#262E38',
      brown: '#362C28',
      onBrown: '#FFE082',
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

export const darkTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            width: '26px',
          },
          '&::-webkit-scrollbar-track': {
            margin: 0.1,
          },
          '&::-webkit-scrollbar-thumb': {
            boxShadow: 'inset 0 0 10px 10px #ffffffaa',
            border: 'solid 10px transparent',
            borderRadius: '20px',
            minHeight: '40px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            boxShadow: 'inset 0 0 10px 10px #ffffffdd',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 'normal',
          fontFamily: ['Roboto', 'cursive'].join(','),
        },
      },
    },
  },
  palette: {
    customPalette: {
      background: '#262E38',
      surface: '#2B3D49',
      primary: '#425C71',
      secondary: '#A5C8E8',
      onBackground: '#f4f4f4',
      onBackgroundSpecial: '#FFE082',
      onSurface: '#ffffff',
      onPrimary: '#ffffff',
      onSecondary: '#2B3D49',
      error: '#604e57',
      onError: '#FF8282',
      accent: '#FFE082',
      onAccent: '#262E38',
      red: '#FF8282',
      onRed: '#262E38',
      brown: '#362C28',
      onBrown: '#FFE082',
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
      onBackground?: string;
      onBackgroundSpecial?: string;
      onSurface?: string;
      onPrimary?: string;
      onSecondary?: string;
      error?: string;
      onError?: string;
      accent?: string;
      onAccent?: string;
      red?: string;
      onRed?: string;
      brown?: string;
      onBrown?: string;
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
