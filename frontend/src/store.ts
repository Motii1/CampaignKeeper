import { applyMiddleware, createStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { appReducer } from './reducer';

const thunkEnhancer = applyMiddleware(thunkMiddleware);

export const store = createStore(rootReducer, thunkEnhancer);

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
