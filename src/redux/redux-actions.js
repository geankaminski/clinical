import invariant from 'invariant';
import { createAction as reduxCreateAction } from 'redux-actions';
import { isFunction, omit } from 'lodash';

import restApis from './restApis';

export const createAction = reduxCreateAction;

export const apiTypes = type => [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`, `${type}_CLEAR`];

export const createClearAction = type => reduxCreateAction(`${type}_CLEAR`);

export function createApiAction(
  type,
  apiCall,
  metaCreator,
) {
  const types = apiTypes(type).slice(0, 3);
  invariant(isFunction(apiCall), 'Expected apiCall to be a function');

  const hasMeta = isFunction(metaCreator);

  const actionCreator = (...args) => {
    const payload = args[args.length - 1];
    const action = { types, apiCall, args };
    if (payload instanceof Error) {
      action.error = true;
    }

    if (payload !== undefined) {
      action.payload = omit(payload, ['onSuccess', 'onFailure']);
      action.onSuccess = payload.onSuccess;
      action.onFailure = payload.onFailure;
    }
    if (hasMeta) {
      action.meta = metaCreator(...args);
    }
    return action;
  };

  return actionCreator;
}

export const restApiActions = (...models) => {
  const apis = restApis(...models);
  const reducerName = models.join('/');

  return {
    create: createApiAction(`${reducerName}_CREATE`, apis.create),
    list: createApiAction(`${reducerName}_LIST`, apis.list),
    read: createApiAction(`${reducerName}_READ`, apis.read),
    remove: createApiAction(`${reducerName}_REMOVE`, apis.remove),
    update: createApiAction(`${reducerName}_UPDATE`, apis.update),
  };
};

export const restApiStates = (
  models,
  name,
  { update = true, isClear = false } = {},
) => {
  const reducerName = models.join('/');

  return [
    { type: `${reducerName}_CREATE`, name, append: `${name}s` },
    { type: `${reducerName}_LIST`, name: `${name}s`, clear: isClear },
    { type: `${reducerName}_UPDATE`, name, update: update && `${name}s` },
    { type: `${reducerName}_READ`, name, update: update && `${name}s` },
    { type: `${reducerName}_REMOVE`, name, remove: `${name}s` },
    { type: `${reducerName}_SEARCH`, name, append: `${name}s` },
  ];
};
