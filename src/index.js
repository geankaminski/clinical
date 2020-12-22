import React from 'react';
import { render } from 'react-dom';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import Router from 'router';
import CssBaseline from '@material-ui/core/CssBaseline';
import './index.css';

import './redux/localStorage';
import { configureStore, history } from 'redux/store';

const initialState = fromJS({});
const store = configureStore(initialState);
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <CssBaseline />
      <Router />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));
