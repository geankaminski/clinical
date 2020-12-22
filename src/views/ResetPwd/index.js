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
import axios from 'axios';

import { Input } from 'components';

import { CircularProgress, Grid } from '@material-ui/core';
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
    fontSize: '50px',
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
    marginBottom: '5%',
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

const ResetPwd = ({
  signup,
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  // const accessToken = get(tokenInfo.toJS(), 'session.accessToken');
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [userKey, setUserKey] = useState('');
  const [view, setView] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const onSubmit = () => {
    let bodyFormData = new FormData();
    bodyFormData.append('email', email);
    axios({
      method: 'post',
      url: 'https://clinicalbook.polijrinternal.com/api/esqueci-senha',
      data: bodyFormData,
    })
      .then(function (res) {
        console.log(res.data.chave);
        setKey(res.data.chave);
        setView(2);
      });
  };

  const onSubmitKey = () => {
    if (key === userKey) {
      setView(3);
    } else {
      console.log("chaves diferentes");
    }
  };

  const onSubmitPwd = () => {
    if (password === confirmPwd) {
      let bodyFormData = new FormData();
      bodyFormData.append('senha_nova', password);
      bodyFormData.append('senha_nova_confirmacao', confirmPwd);
      axios({
        method: 'post',
        url: `https://clinicalbook.polijrinternal.com/api/alterar-senha/${key}`,
        data: bodyFormData,
      })
        .then(function (res) {
          setView(4);
        });
    } else {
      console.log("senhas diferentes");
    }
  };

  return (
    <div className={classes.container}>
      <Grid className={classes.title}>
        <h1>Clinical Book</h1>
      </Grid>

      <div className={classes.subTitle}>
        <p>Recuperar senha</p>
      </div>

      {view === 1 && (
        <>
          <Input
            width="33%"
            id="email"
            name="email"
            placeholder="Digite o e-mail cadastrado"
            value={email}
            type="text"
            onChange={({ target: { value } }) => setEmail(value)}
          />

          <div className={classes.centerLogin}>
            <Button
              type="submit"
              className={classes.submit}
              onClick={onSubmit}
            >
              {authRequesting ? (
                <CircularProgress color="white" />
              ) : ('Enviar')}
            </Button>
          </div>
        </>
      )}

      {view === 2 && (
        <>
          <Input
            width={558}
            id="user-key"
            name="user-key"
            placeholder="Digite a chave enviada para seu e-mail"
            value={userKey}
            type="text"
            onChange={({ target: { value } }) => setUserKey(value)}
          />

          <div className={classes.centerLogin}>
            <Button
              type="submit"
              className={classes.submit}
              onClick={onSubmitKey}
            >
              {authRequesting ? (
                <CircularProgress color="white" />
              ) : ('Enviar')}
            </Button>
          </div>
        </>
      )}

      {view === 3 && (
        <>
          <Input
            width={558}
            id="password"
            name="password"
            placeholder="Digite a nova senha"
            value={password}
            type="password"
            onChange={({ target: { value } }) => setPassword(value)}
          />

          <Input
            width={558}
            id="confirmpwd"
            name="confirmpwd"
            placeholder="Confirma a nova senha"
            value={confirmPwd}
            type="password"
            onChange={({ target: { value } }) => setConfirmPwd(value)}
          />

          <div className={classes.centerLogin}>
            <Button
              type="submit"
              className={classes.submit}
              onClick={onSubmitPwd}
            >
              {authRequesting ? (
                <CircularProgress color="white" />
              ) : ('Enviar')}
            </Button>
          </div>
        </>
      )}

      {view === 4 && (
        <>
        <div className={classes.subTitle}>
          <p>Senha modificada com sucesso!</p>
        </div>
         <div className={classes.centerLogin}>
         <Button
           to="/login"
           component={Link}
           className={classes.userRedirect}
         >
            Fazer login
           </Button>
       </div>
       </>
      )}


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
  );
};

ResetPwd.propTypes = {
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
  setDisplayName('ResetPwd'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(ResetPwd);
