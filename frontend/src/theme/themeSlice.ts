import { Theme } from '@mui/system';
import { createSlice } from '@reduxjs/toolkit';
import { darkTheme } from './theme';

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
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
      state.isLight = action.payload.isLight;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
