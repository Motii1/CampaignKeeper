import { configureStore } from '@reduxjs/toolkit';
import errorReducer from './views/ErrorView/errorSlice';

export const store = configureStore({
  reducer: {
    errors: errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
