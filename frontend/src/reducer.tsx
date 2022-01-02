import { combineReducers } from 'redux';
import errorReducer from './views/ErrorView/errorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';

export const rootReducer = combineReducers({
  user: userDetailsReducer,
  error: errorReducer,
});
