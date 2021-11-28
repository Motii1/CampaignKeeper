import { createSlice } from '@reduxjs/toolkit';
import { View } from '../enums/View';

export const viewsSlice = createSlice({
  name: 'views',
  initialState: {
    value: View.Start,
  },
  reducers: {
    goToView: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { goToView } = viewsSlice.actions;

export default viewsSlice.reducer;
