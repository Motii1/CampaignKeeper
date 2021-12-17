import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

export const fetchUserDetails = createAsyncThunk('userDetails/fetchDetails', async () => {
  const response = await protectedApiClient.get('api/user/details');
  return response.data;
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
  },
  extraReducers: builder => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.isDownloaded = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    });
  },
});

export const { updateDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
