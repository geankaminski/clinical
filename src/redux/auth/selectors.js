import { createSelector } from 'reselect';
import { getSelector } from 'redux/selectors';

export const currentUserSelector = createSelector(getSelector('auth', 'tokenInfo'), state => state.getIn(['data', 'user']));
