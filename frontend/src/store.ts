import { applyMiddleware, createStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducer';

const thunkEnhancer = applyMiddleware(thunkMiddleware);

export const store = createStore(rootReducer, thunkEnhancer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
