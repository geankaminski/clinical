import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter, Link } from 'react-router-dom';
import { setDisplayName, compose } from 'recompose';
import { selectState, getRequestingSelector } from 'redux/selectors';
import immutableToJS from 'helpers/immutableToJS';
import { signup } from 'redux/auth/actions';
import { setGlobalNotification } from 'redux/ui/actions';

import { Input } from 'components';

import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: 'Caudex',
    fontSize: '3.5rem',
    lineHeight: '30px',
    alignItems: 'center',
    textAlign: 'center',
    color: '#3AAC9E',
    paddingTop: '15px',
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: '40px',
    lineHeight: '30px',
    textAlign: 'center',
  },
  centerLogin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  dateLogin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '360px',
  },
  submit: {
    background: '#3AAC9E',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    width: '180px',
    height: '44px',
    color: "#fff",
    marginTop: '20px',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  userRedirect: {
    fontFamily: 'Montserrat',
    fontSize: '23px',
    lineHeight: '30px',
    textAlign: 'center',
    color: '#3AAC9E',
    marginTop: '39px',
    textTransform: 'capitalize',
  },
}));

const Signup = ({
  signup,
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  // const accessToken = get(tokenInfo.toJS(), 'session.accessToken');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const onSubmit = () => {
    if (password === confirmPwd) {
      signup({
        email: user,
        password,
        onSuccess: () => {
          history.push('/usuarios');
        },
        onFailure: () => {
          console.log('falhou');
        },
      });
    } else {
      console.log('senhas diferentes');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <h1>Clinical Book</h1>
      </div>

      <div className={classes.subTitle}>
        <p>Cadastro</p>
      </div>
        <Input
          width="32%"
          id="user"
          name="user"
          placeholder="Usuário"
          value={user}
          type="text"
          onChange={({ target: { value } }) => setUser(value)}
        />
        <Input
          width="32%"
          id="password"
          name="password"
          placeholder="Senha"
          value={password}
          type="password"
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <Input
          width="32%"
          id="passwordConfirm"
          name="passwordConfirm"
          placeholder="Confirmação de senha"
          value={confirmPwd}
          type="password"
          onChange={({ target: { value } }) => setConfirmPwd(value)}
        />
      <div className={classes.centerLogin}>
        <Button
          type="submit"
          className={classes.submit}
          onClick={onSubmit}
        >
          {authRequesting ? (
            <CircularProgress color="white" />
          ) : ('Cadastrar')}
        </Button>
      </div>
      <div className={classes.centerLogin}>
        <Button
          to="/login"
          component={Link}
          className={classes.userRedirect}
        >
          Já possui cadastro? <br />
          Faça login aqui.
        </Button>
      </div>
    </div>
  );
};

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  tokenInfo: ImmutablePropTypes.mapContains({
    success: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setGlobalNotification: PropTypes.func.isRequired,
  authRequesting: PropTypes.bool,
};

const mapStateToProps = state => ({
  ...selectState('auth', 'tokenInfo')(state, 'tokenInfo'),
  authRequesting: getRequestingSelector('auth', 'tokenInfo')(state),
});

const mapDispatchToProps = dispatch => ({
  signup: payload => dispatch(signup(payload)),
  setGlobalNotification: payload => dispatch(setGlobalNotification(payload)),
});

export default compose(
  setDisplayName('Signup'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(Signup);
