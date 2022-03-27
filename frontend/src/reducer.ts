import { AnyAction, combineReducers } from 'redux';
import { RootState } from './store';
import campaignViewReducer from './views/CampaignView/campaignViewSlice';
import errorReducer from './views/ErrorView/errorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';
import campaignsReducer from './views/StartView/campaignsSlice';
import startViewReducer from './views/StartView/startViewSlice';

export const appReducer = combineReducers({
  user: userDetailsReducer,
  error: errorReducer,
  startView: startViewReducer,
  campaignView: campaignViewReducer,
  campaigns: campaignsReducer,
});

const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === 'USER_LOGOUT') {
    state = {} as RootState;
  }

  return appReducer(state, action);
};

export default rootReducer;