import { createSlice } from '@reduxjs/toolkit';

const axiosErrorSlice = createSlice({
  name: 'axiosError',
  initialState: {
    isError: false,
  },
  reducers: {
    updateAxiosError: (state, action) => {
      state.isError = action.payload.isError;
    },
  },
});

export const { updateAxiosError } = axiosErrorSlice.actions;

export default axiosErrorSlice.reducer;
