import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter, Link } from 'react-router-dom';
import { setDisplayName, compose } from 'recompose';
import { selectState, getRequestingSelector } from 'redux/selectors';
import immutableToJS from 'helpers/immutableToJS';
import { login } from 'redux/auth/actions';
import { setGlobalNotification } from 'redux/ui/actions';

import { isMobile } from 'helpers';
import { default as logoLogin } from 'assets/img/logo-login.svg';
import { default as bookLogin } from 'assets/img/book-login.svg';

import { Input } from 'components';

import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  container: {

  },
  header: {
    textAlign: 'right',
  },
  headerButton: {
    width: '205px',
    height: '95px',
    background: '#3AAC9E',
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '30px',
    lineHeight: '37px',
    textTransform: 'capitalize',
    borderRadius: '0px',
    marginRight: isMobile ? '15px' : '28px',
    marginTop: '25px',
    textAlign: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
    marginTop: '7%',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  logoImg: {
    maxWidth: '410px',
    marginLeft: '10%',
    display: isMobile && 'none',
  },
  bookImg: {
    maxWidth: '410px',
    position: 'absolute',
    left: '9%',
    top: '51%',
    display: isMobile && 'none',
  },
  loginBox: {
    position: !isMobile && 'absolute',
    width: isMobile ? '90%' : '350px',
    paddingTop: isMobile && '30px',
    height: 'fit-content',
    right: '7%',
    top: '21%',
    margin: isMobile && '0 auto',
    marginTop: isMobile && '30px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '30px',
  },
  loginText: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '30px',
    lineHeight: '44px',
    marginTop: '10%',
    marginBottom: '10%',
    textAlign: 'center',
  },
  userRedirect: {
    fontFamily: 'Montserrat',
    fontSize: '20px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#001524',
    marginTop: '6%',
    marginBottom: '5%',
    textTransform: 'capitalize',
  },
  userRedirectPwd: {
    fontFamily: 'Montserrat',
    fontSize: '12px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#001524',
    textTransform: 'none',
  },
  centerLogin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const SignIn = ({
  login,
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = () => {
    login({
      username,
      password,
      onSuccess: () => {
        history.push('/usuarios');
      },
      onFailure: () => {
        setError(true);
      },
    });
  };

  return (
    <div
      className={classes.container}
    >
      <header className={classes.header}>
        <Button
          component={Link}
          to="/token"
          className={classes.headerButton}
        >
          Área do
          médico
        </Button>
      </header>

      <div>
        <img src={logoLogin} className={classes.logoImg} alt="" />
      </div>
      <div>
        <img src={bookLogin} className={classes.bookImg} alt="" />
      </div>

      <div className={classes.loginBox}>
        <div className={classes.loginText}>Faça login</div>
        <Input
          width="267.93px"
          placeholder="Usuário"
          value={username}
          name="user"
          type="text"
          id="user"
          onChange={({ target: { value } }) => setUsername(value)}
        />

        <Input
          width="267.93px"
          placeholder="Senha"
          value={password}
          name="password"
          type="password"
          id="password"
          onChange={({ target: { value } }) => setPassword(value)}
        />

        {error && (
          <Alert severity="error" style={{ width: '70%', margin: '0 auto' }}>Usuário/Senha incorreto(s)!</Alert>
        )}


        <div className={classes.centerLogin}>
          <Button
            to="/recuperar-senha"
            component={Link}
            className={classes.userRedirectPwd}
          >
            Esqueci minha senha
          </Button>
        </div>

        <div className={classes.centerLogin}>
          <Button
            type="submit"
            variant="contained"
            className={classes.submit}
            onClick={onSubmit}
          >
            {authRequesting ? (
              <CircularProgress />
            ) : ('Entrar')}
          </Button>
        </div>
        <div className={classes.centerLogin}>
          <Button
            to="/signup"
            component={Link}
            className={classes.userRedirect}
          >
            Ainda não é um usuário?<br />
            Cadastre-se
          </Button>
        </div>

      </div>

    </div>
  );
};

SignIn.propTypes = {
  login: PropTypes.func.isRequired,
  tokenInfo: ImmutablePropTypes.mapContains({
    success: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setGlobalNotification: PropTypes.func.isRequired,
  authRequesting: PropTypes.bool,
};

SignIn.defaultProps = {
  tokenInfo: ImmutablePropTypes.map,
  authRequesting: false,
};

const mapStateToProps = state => ({
  ...selectState('auth', 'tokenInfo')(state, 'tokenInfo'),
  authRequesting: getRequestingSelector('auth', 'tokenInfo')(state),
});

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(login(payload)),
  setGlobalNotification: payload => dispatch(setGlobalNotification(payload)),
});

export default compose(
  setDisplayName('SignIn'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(SignIn);
