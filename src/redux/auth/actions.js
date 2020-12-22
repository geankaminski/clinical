import { createApiAction } from 'redux/redux-actions';
import restApis from '../restApis';
import {
  LOGIN,
  SIGNUP,
  AVATAR,
  EXAM,
} from '../constants';

const loginApi = restApis('login/');
const signupApi = restApis('user/');
const avatarApi = restApis('avatar/');
const examApi = restApis('exames/');

export const login = createApiAction(LOGIN, loginApi.create);
export const signup = createApiAction(SIGNUP, signupApi.create);
export const avatar = createApiAction(AVATAR, avatarApi.create);
export const exam = createApiAction(EXAM, examApi.create);
