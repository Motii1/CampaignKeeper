import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice responsible for storing data about error
 * which occured in our application (or not)
 */
const errorSlice = createSlice({
  name: 'error',
  initialState: {
    isError: false,
    message: null,
  },
  reducers: {
    setError: (state, action) => {
      state.isError = action.payload.isError;
      state.message = action.payload.message;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearError: (state, _action) => {
      state.isError = false;
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
