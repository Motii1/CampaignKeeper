import { createSlice } from '@reduxjs/toolkit';

const axiosErrorSlice = createSlice({
  name: 'axiosError',
  initialState: {
    isError: false,
    status: null,
    message: '',
  },
  reducers: {
    updateAxiosError: (state, action) => {
      state.isError = action.payload.isError;
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
  },
});

export const { updateAxiosError } = axiosErrorSlice.actions;

export default axiosErrorSlice.reducer;
