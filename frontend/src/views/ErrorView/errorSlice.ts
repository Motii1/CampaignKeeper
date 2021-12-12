import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    isError: false,
    message: 'Unexpected error',
  },
  reducers: {
    setError: (state, action) => {
      state.isError = action.payload.isError;
      state.message = action.payload.message;
    },
    clearError: state => {
      state.isError = false;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
