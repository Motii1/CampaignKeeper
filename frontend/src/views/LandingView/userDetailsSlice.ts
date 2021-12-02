import { createSlice } from '@reduxjs/toolkit';

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: {
    isDownloaded: false,
    username: null,
    email: null,
  },
  reducers: {
    updateDetails: (state, action) => {
      state.isDownloaded = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const { updateDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
