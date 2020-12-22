import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router';
import auth from './auth/reducer';
import ui from './ui/reducer';

const rootReducer = history => combineReducers({
  router: connectRouter(history),
  auth,
  ui,
});

export default rootReducer;
