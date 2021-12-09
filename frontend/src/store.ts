import { configureStore } from '@reduxjs/toolkit';
import errorReducer from './views/ErrorView/errorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';

export const store = configureStore({
  reducer: {
    userDetailsReducer,
    errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
