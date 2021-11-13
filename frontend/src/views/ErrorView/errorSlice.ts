import { createSlice } from '@reduxjs/toolkit';

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    value: false,
  },
  reducers: {
    setError: state => {
      state.value = true;
    },
  },
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
