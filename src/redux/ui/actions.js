import { createAction, createClearAction } from 'redux/redux-actions';
import {
  GLOBAL_NOTIFICATION,
} from 'redux/constants';

export const setGlobalNotification = createAction(GLOBAL_NOTIFICATION);
export const clearGlobalNotification = createClearAction(GLOBAL_NOTIFICATION);
