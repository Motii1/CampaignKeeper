import { createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';
import { AppDispatch } from '../../store';

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

export const fetchUserDetails = async (dispatch: AppDispatch): Promise<void> => {
  const response = await protectedApiClient.get('api/user/details');
  if (response.status === 200)
    dispatch(updateDetails({ username: response.data.username, email: response.data.email }));
};
