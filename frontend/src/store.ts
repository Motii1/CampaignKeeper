import { configureStore } from '@reduxjs/toolkit';
import axiosErrorReducer from './axios/axiosErrorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';

export const store = configureStore({
  reducer: {
    userDetailsReducer,
    axiosErrorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
