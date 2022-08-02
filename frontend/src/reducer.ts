import { AnyAction, combineReducers } from 'redux';
import { RootState } from './store';
import themeReducer from './theme/themeSlice';
import campaignViewReducer from './views/CampaignView/campaignViewSlice';
import sessionsReducer from './views/CampaignView/sessionsSlice';
import codexReducer from './views/CodexView/codexSlice';
import codexViewReducer from './views/CodexView/codexViewSlice';
import errorReducer from './views/ErrorView/errorSlice';
import explorerViewReducer from './views/ExplorerView/explorerViewSlice';
import userDetailsReducer from './views/LandingView/userDetailsSlice';
import eventsSlice from './views/MapView/eventsSlice';
import mapViewReducer from './views/MapView/mapViewSlice';
import campaignsReducer from './views/StartView/campaignsSlice';
import startViewReducer from './views/StartView/startViewSlice';

/**
 * Reducer for reducer from all slices used in project
 */
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
  events: eventsSlice,
  mapView: mapViewReducer,
  explorerView: explorerViewReducer,
});

/**
 * Used to clear store after user logout
 * @param state
 * @param action
 * @returns
 */
const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === 'USER_LOGOUT') {
    state = {} as RootState;
  }

  return appReducer(state, action);
};

export default rootReducer;
