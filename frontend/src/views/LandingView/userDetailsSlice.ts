import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';
interface UserState {
  isDownloaded: boolean;
  username: null | string;
  email: null | string;
  avatar: null | string;
}

const initialState: UserState = {
  isDownloaded: false,
  username: null,
  email: null,
  avatar: null,
};

export const fetchUserDetails = createAsyncThunk('userDetails/fetchDetails', async () => {
  const response = await protectedApiClient.get('api/user/details');
  return response;
});

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    updateDetails: (state, action) => {
      state.isDownloaded = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      if (action.payload.avatar) state.avatar = action.payload.avatar;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearDetails: (state, _action) => {
      state.isDownloaded = false;
      state.username = null;
      state.email = null;
      state.avatar = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isDownloaded = true;
        state.username = action.payload.data.username;
        state.email = action.payload.data.email;
        state.avatar = action.payload.data.image;
      }
    });
  },
});

export const { updateDetails, clearDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
