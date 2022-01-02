import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

export const fetchUserDetails = createAsyncThunk('userDetails/fetchDetails', async () => {
  const response = await protectedApiClient.get('api/user/details');
  return response;
});

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearDetails: (state, _action) => {
      state.isDownloaded = false;
      state.username = null;
      state.email = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isDownloaded = true;
        state.username = action.payload.data.username;
        state.email = action.payload.data.email;
      }
    });
  },
});

export const { updateDetails, clearDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
