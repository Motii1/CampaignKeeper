import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    isError: false,
    message: null,
  },
  reducers: {
    updateError: (state, action) => {
      state.isError = action.payload.isError;
      state.message = action.payload.message;
    },
    clearError: state => {
      state.isError = false;
      state.message = null;
    },
  },
});

export const { updateError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
