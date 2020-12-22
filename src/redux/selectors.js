import { createSelector } from 'reselect';

export const getSelector = (reducer, name) => {
  const reducerSelector = state => state.get(reducer);
  return createSelector(reducerSelector, state => state.get(name));
};

export const getDataSelector = (reducer, name) => {
  const propertySelector = getSelector(reducer, name);
  return createSelector(propertySelector, state => state.get('data'));
};

export const getRequestingSelector = (reducer, name) => {
  const propertySelector = getSelector(reducer, name);
  return createSelector(propertySelector, state => state.get('requesting'));
};

export const getErrorSelector = (reducer, name) => {
  const propertySelector = getSelector(reducer, name);
  return createSelector(propertySelector, state => state.get('error'));
};

export const getMetaSelector = (reducer, name) => {
  const propertySelector = getSelector(reducer, name);
  return createSelector(propertySelector, state => state.get('meta'));
};

export const selectState = (reducer, name) => (state, objectName) => ({
  [objectName]: getDataSelector(reducer, name)(state),
  [`${objectName}Requesting`]: getRequestingSelector(reducer, name)(state),
  [`${objectName}Error`]: getErrorSelector(reducer, name)(state),
  [`${objectName}Meta`]: getMetaSelector(reducer, name)(state),
});
