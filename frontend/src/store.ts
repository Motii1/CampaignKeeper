import { configureStore } from '@reduxjs/toolkit';
import userDetailsReducer from './views/LandingView/userDetailsSlice';

export const store = configureStore({
  reducer: {
    userDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
