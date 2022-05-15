import { Theme } from '@mui/system';
import { createSlice } from '@reduxjs/toolkit';
import { darkTheme, lightTheme } from './theme';

interface ThemeState {
  theme: Theme;
  isLight: boolean;
}

const initialState: ThemeState = {
  theme: darkTheme,
  isLight: false,
};

const themeSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    checkAndSetTheme: (state, action) => {
      if (action.payload.isLight) {
        state.theme = action.payload.isLight === 'light' ? lightTheme : darkTheme;
        state.isLight = action.payload.isLight === 'light';
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
      state.isLight = action.payload.isLight;
    },
  },
});

export const { checkAndSetTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
