import invariant from 'invariant';
import { startCase, last } from 'lodash';
import { clearAuthToken } from './auth/actions';
import { setGlobalNotification } from './ui/actions';
import { push } from 'connected-react-router';
import {
  GLOBAL_NOTIFICATION,
} from './constants';
/**
 * requestStatusMiddleware takes an API Request action and handles updating the state
 * when requesting as well as dispatching actions for success and failure cases.
 */
export default function requestStatusMiddleware({ dispatch }) {
  return next => async (action) => {
    const { types, apiCall, payload = {}, onSuccess, onFailure, notification, args } = action;
    // requestStatusMiddleware requires 3 action types, *_REQUEST, *_SUCCESS, *_FAILURE.
    // If the `types` key is absent, pass this action along to the next middleware.
    if (!types) {
      return next(action);
    }

    // The `types` key must be an array of 3 strings. If not, throw an error.
    invariant(
      Array.isArray(types)
      && types.length === 3
      && types.every(type => typeof type === 'string'),
      'requestStatusMiddleware expected `types` to be an array of 3 strings',
    );

    // The `apiCall` key must be a function.
    invariant(
      typeof apiCall === 'function',
      'requestStatusMiddleware expected `apiCall` to be a function',
    );
    const showError = !(notification && notification.noError);
    const [requestType, successType, failureType] = types;

    dispatch({ type: requestType, payload });
    const data = await apiCall(...args);
    const { response, error } = data || { error: 'empty' };
    if (error && error.status === 403) {
      dispatch(setGlobalNotification({
        type: 'error',
        message: 'Sessão expirada! Logue-se novamente.',
      }));
      dispatch(clearAuthToken());
      dispatch(push('/login'));
    } else if (error) {
      dispatch({
        data: {},
        type: failureType,
        error: true,
        payload: { error },
        request: payload,
        onFailure,
      });
    } else if (response && (error || !response.body) && showError) {
      dispatch({
        type: failureType,
        error: true,
        payload: error,
        request: payload,
      });
      if (error.title || error.detail) {
        dispatch({
          type: GLOBAL_NOTIFICATION,
          payload: {
            data: error,
            kind: 'error',
          },
        });
      } else {
        dispatch({
          type: GLOBAL_NOTIFICATION,
          payload: {
            data: { title: startCase(last(requestType.split('/'))), detail: error },
            kind: 'error',
          },
        });
      }
    } else if (response && response.body.status === 'error' && showError) {
      const error = {
        title: 'Error',
        detail: response.body.message,
        statusCode: response.statusCode,
      };
      dispatch({
        type: failureType,
        error: true,
        payload: error,
        request: payload,
      });
      dispatch({
        type: GLOBAL_NOTIFICATION,
        payload: {
          data: error,
          kind: 'error',
        },
      });
    } else {
      if (response) {
        dispatch({ type: successType, payload: response.body, request: payload, onSuccess });
      } else {
        dispatch({ type: successType, payload: '{}', request: payload, onSuccess });
      }
      if (notification && (notification.title || notification.detail)) {
        dispatch({
          type: GLOBAL_NOTIFICATION,
          payload: {
            data: notification,
            kind: 'success',
          },
        });
      } else if (response && response.body.message) {
        dispatch({
          type: GLOBAL_NOTIFICATION,
          payload: {
            data: {
              title: 'Success',
              detail: response.body.message,
            },
            kind: 'success',
          },
        });
      }
    }
    return true;
  };
}
