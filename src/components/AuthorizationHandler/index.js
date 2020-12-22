/**
 * This wraps all routes, and is mounted anytime a user is viewing the application.
 * It verifies that a user is authroized to view the application and spawns a token refresh process.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getDataSelector } from 'redux/selectors';
import { setDisplayName, compose } from 'recompose';
import { connect } from 'react-redux';
import { AppContext } from 'components/AppContext';


const AuthorizationHandler = ({
  tokenInfo,
  children,
}) => {
  const accessToken = get(tokenInfo.toJS(), 'token');
  // const roleId = get(tokenInfo.toJS(), 'user.role.id');
  // const appType = getContext(roleId);

  useEffect(() => {
  }, []);

  if (!accessToken) {
    return <Redirect to="/login" />;
  }

  return (
    <AppContext.Provider>
      {children}
    </AppContext.Provider>
  );
};

AuthorizationHandler.propTypes = {
  children: PropTypes.node.isRequired,
  tokenInfo: ImmutablePropTypes.mapContains({
    success: PropTypes.string,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}),
    url: PropTypes.string,
  }).isRequired,
};

AuthorizationHandler.defaultProps = {
  tokenInfo: ImmutablePropTypes.map,
};

const mapStateToProps = state => ({
  tokenInfo: getDataSelector('auth', 'tokenInfo')(state),
});

export default compose(
  setDisplayName('AuthorizationHandler'),
  connect(mapStateToProps),
  withRouter,
)(AuthorizationHandler);
