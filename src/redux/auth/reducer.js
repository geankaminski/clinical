import generateHandlerActions from 'redux/state-handler';
import {
  LOGIN,
  SIGNUP,
  AVATAR,
  EXAM,
} from '../constants';

const apiStates = [
  { type: LOGIN, name: 'tokenInfo' },
  { type: SIGNUP, name: 'tokenInfo' },
  { type: AVATAR, name: 'avatar' },
  { type: EXAM, name: 'exam' },
];
const instantStates = [];
const storage = {
  tokenInfo: 'tokenInfo',
};
const listValues = [];

export default generateHandlerActions({ apiStates, instantStates, storage, listValues });
