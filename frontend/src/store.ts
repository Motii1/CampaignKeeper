import { configureStore } from '@reduxjs/toolkit';
import viewsReducer from './views/viewsSlice';

export const store = configureStore({
  reducer: {
    views: viewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
