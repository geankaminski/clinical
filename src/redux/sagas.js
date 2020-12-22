import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([]); // for now it's empty. Will add some later if necessary.
}
