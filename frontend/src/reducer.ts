import { AnyAction, combineReducers } from 'redux';
import { RootState } from './store';
import themeReducer from './theme/themeSlice';
import campaignViewReducer from './views/CampaignView/campaignViewSlice';
import sessionsReducer from './views/CampaignView/sessionsSlice';
import codexReducer from './views/CodexView/codexSlice';
import codexViewReducer from './views/CodexView/codexViewSlice';
import errorReducer from './views/ErrorView/errorSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';
import sessionReducer from './views/MapView/sessionSlice';
import campaignsReducer from './views/StartView/campaignsSlice';
import startViewReducer from './views/StartView/startViewSlice';

export const appReducer = combineReducers({
  theme: themeReducer,
  user: userDetailsReducer,
  error: errorReducer,
  startView: startViewReducer,
  campaignView: campaignViewReducer,
  campaigns: campaignsReducer,
  sessions: sessionsReducer,
  codexView: codexViewReducer,
  codex: codexReducer,
  session: sessionReducer,
});

const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === 'USER_LOGOUT') {
    state = {} as RootState;
  }

  return appReducer(state, action);
};

export default rootReducer;
