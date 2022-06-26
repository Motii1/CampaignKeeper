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
            boxShadow: 'inset 0 0 10px 10px #000000aa',
            border: 'solid 10px transparent',
            borderRadius: '20px',
            minHeight: '40px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            boxShadow: 'inset 0 0 10px 10px #000000dd',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#15191f',
          fontWeight: 'normal',
          fontFamily: ['Roboto', 'cursive'].join(','),
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
          color: '#262E38',
        },
      },
    },
  },
  palette: {
    customPalette: {
      background: '#f4f9fb',
      surface: '#e1ebf5',
      primary: '#e8f0f7',
      secondary: '#f5ebf7',
      tertiary: '#dceff0',
      onBackground: '#303d50',
      onBackgroundVariant: '#446182',
      onSurface: '#262E38',
      onPrimary: '#262E38',
      onSecondary: '#242424',
      onTertiary: '#262E38',
      error: '#f2d4d4',
      onError: '#b65757',
      accent: '#a7ccf7',
      onAccent: '#242424',
      red: '#ee7979',
      onRed: '#262E38',
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
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
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
      tertiary: '#362C28',
      onBackground: '#f4f4f4',
      onBackgroundVariant: '#FFE082',
      onSurface: '#ffffff',
      onPrimary: '#ffffff',
      onSecondary: '#2B3D49',
      onTertiary: '#FFE082',
      error: '#604e57',
      onError: '#FF8282',
      accent: '#FFE082',
      onAccent: '#262E38',
      red: '#FF8282',
      onRed: '#262E38',
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
      tertiary?: string;
      onBackground?: string;
      onBackgroundVariant?: string;
      onSurface?: string;
      onPrimary?: string;
      onSecondary?: string;
      onTertiary?: string;
      error?: string;
      onError?: string;
      accent?: string;
      onAccent?: string;
      red?: string;
      onRed?: string;
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
