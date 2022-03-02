import { combineReducers } from 'redux';
import campaignViewReducer from './views/CampaignView/campaignViewSlice';
import errorReducer from './views/ErrorView/errorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';
import startViewReducer from './views/StartView/startViewSlice';

export const rootReducer = combineReducers({
  user: userDetailsReducer,
  error: errorReducer,
  startView: startViewReducer,
  campaignView: campaignViewReducer,
});
