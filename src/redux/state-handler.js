import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { get as lodashGet, isEmpty, omit } from 'lodash';

import { apiTypes } from './redux-actions';

const storeMemory = (storage, name, data) => {
  if (storage[name] && !isEmpty(data)) {
    memoryDB[storage[name]] = JSON.stringify({ data });
  } else {
    memoryDB.removeItem(name);
  }
};

const loadMemory = (storage, name, defaultValue) => {
  if (storage[name]) {
    return (JSON.parse(window.memoryDB[storage[name]] || '{}').data || defaultValue);
  }
  return defaultValue;
};

const defaultObject = {
  requesting: false,
  meta: {},
  error: {},
  data: {},
};

const apiStateHandlers = (states, storage, listValues) => {
  let actionHandlers = {};
  let initialState = {};
  states.forEach((state) => {
    const {
      type,
      name,
      apiField,
      append,
      update,
      remove,
      onSuccess,
      onFailure,
      clear,
      pagination,
    } = state;
    const types = apiTypes(type);
    const defaultValue = listValues.indexOf(name) === -1 ? {} : [];
    actionHandlers = {
      ...actionHandlers,
      // request
      [types[0]]: (state) => {
        const newState = state
          .setIn([name, 'requesting'], true)
          // .setIn([name, 'meta'], fromJS({}))
          .setIn([name, 'error'], fromJS({}));
        if (clear) {
          return newState.setIn([name, 'data'], fromJS(defaultValue));
        }
        return newState;
      },
      // success
      [types[1]]: (state, action) => {
        const payload = fromJS(
          apiField ? lodashGet(action.payload, apiField) : action.payload,
        ) || fromJS(defaultValue);
        // const meta = fromJS(action.payload.meta);
        // console.log(action.meta, 'state-handler', name);
        storeMemory(
          storage, name, apiField ? lodashGet(action.payload, apiField) : action.payload,
        );
        if (action.onSuccess) setTimeout(() => action.onSuccess(payload.toJS()), 0);
        const newState = (onSuccess ? onSuccess(state, action) : state)
          .setIn([name, 'requesting'], false)
          .setIn([name, 'data'], payload)
          .setIn([name, 'meta'], pagination ? fromJS({ ...omit(action.payload, [apiField]) }) : fromJS({}));
        // used when creation is done
        if (append) {
          const field = [append, 'data'];
          if (append instanceof Array) {
            field[0] = append[0]; // eslint-disable-line
            field.push(append[1]);
          }
          return newState.updateIn(
            field,
            list => list.unshift(payload),
          );
        }
        // used when update is done
        if (update) {
          const field = [update, 'data'];
          if (update instanceof Array) {
            field[0] = update[0]; // eslint-disable-line
            field.push(update[1]);
          }
          return newState.updateIn(
            field,
            list => list.map(item => (item.get('id') === payload.get('id') ? payload : item)),
          );
        }
        if (remove || payload.get('destroyed')) {
          const field = [remove, 'data'];
          if (remove instanceof Array) {
            field[0] = remove[0]; // eslint-disable-line
            field.push(remove[1]);
          }
          return newState.updateIn(
            field,
            list => list.filter(item => item.get('id') !== payload.get('id')),
          );
        }
        return newState;
      },
      // failure
      [types[2]]: (state, action) => {
        if (action.onFailure) setTimeout(() => action.onFailure(action.payload.error), 0);
        const newState = (onFailure ? onFailure(state, action) : state)
          .setIn([name, 'requesting'], false)
          .setIn([name, 'error'], fromJS(action.payload))
          .setIn([name, 'meta'], fromJS({}));
        return newState;
      },
      // clear
      [types[3]]: (state) => {
        storeMemory(storage, name, {});
        return state
          .setIn([name, 'requesting'], false)
          .setIn([name, 'meta'], fromJS({}))
          .setIn([name, 'data'], fromJS(defaultValue))
          .setIn([name, 'error'], fromJS({}));
      },
    };
    initialState = {
      ...initialState,
      [name]: {
        ...defaultObject,
        data: loadMemory(storage, name, defaultValue),
      },
    };
  });
  return { actionHandlers, initialState };
};

const instantStateHandlers = (states, storage, listValues) => {
  const actionHandlers = {};
  const initialState = {};
  states.forEach((state) => {
    const { type, name, kind } = state;
    const defaultData = listValues.indexOf(name) === -1 ? {} : [];
    const types = apiTypes(type);
    const defaultValue = kind === 'object'
      ? state.defaultValue || defaultData
      : state.defaultValue;
    // set
    actionHandlers[type] = (state, action) => {
      const value = action.payload || defaultValue;
      storeMemory(storage, name, value);
      if (kind === 'object') {
        return state.set(name, fromJS(value));
      }
      return state.set(name, value);
    };
    // clear
    actionHandlers[types[3]] = (state) => {
      storeMemory(storage, name, defaultValue);
      if (kind === 'object') {
        return state.set(name, fromJS(defaultValue));
      }
      return state.set(name, defaultValue);
    };
    const memoryValue = loadMemory(storage, name, defaultValue);
    initialState[name] = memoryValue;
  });
  return { actionHandlers, initialState };
};

/**
 * @typedef {Object} apiState
 * @property {string} apiState.type redux constant
 * @property {string} apiState.name reducer name
 * @property {string} apiState.apiField object response key that holds the data for this reducer
 * @property {(string|string[])} apiField.append string for data when a new addition is done
 * array of string for a deep located data
 * @property {string}
 *
 */

/**
 *  @typedef {Object} generateHandleActionParam
 *  @property {apiState[]}
 *  @property {Object[]}
 */

/**
 * A dynamic state handler which constructs states under a certain architecture. It handle
 * all redux states in the store according to the parameters
 * passed to the actions. It supports api states the data is returned from the
 * rest api connected and instant states that are created to avoid deep nested
 * props.
 *
 *  generateHandleActions({ apiStates, instantStates, storage, listValues })
 *
 * @param {apiState[]} apiStates
 * @returns {function}
 * @public
 */

const generateHandleActions = ({
  apiStates,
  instantStates = [],
  storage = {},
  listValues = [],
}) => {
  const apiHandlers = apiStateHandlers(apiStates, storage, listValues);
  const instantHandlers = instantStateHandlers(
    instantStates,
    storage,
    listValues,
  );
  return handleActions(
    {
      ...apiHandlers.actionHandlers,
      ...instantHandlers.actionHandlers,
    },
    fromJS({
      ...apiHandlers.initialState,
      ...instantHandlers.initialState,
    }),
  );
};

export default generateHandleActions;
