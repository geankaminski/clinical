import generateHandlerActions from 'redux/state-handler';
import {
  GLOBAL_NOTIFICATION,
} from '../constants';

const apiStates = [];
const instantStates = [
  { type: GLOBAL_NOTIFICATION, name: 'globalNotification' },
];
const storage = {};
const listValues = [];

export default generateHandlerActions({ apiStates, instantStates, storage, listValues });
