import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { setDisplayName, compose } from 'recompose';
import { selectState, getRequestingSelector } from 'redux/selectors';
import immutableToJS from 'helpers/immutableToJS';
import { useLocation } from "react-router-dom";
import { curry, get as lodashGet } from 'lodash';
import axios from 'axios';

import { default as avatarImg } from 'assets/img/avatar-img.svg';
import { Input, HeaderGreen, Select, InputFile, InputDate } from 'components';

import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    width: '100%',
    height: '100%',
  },
  containerAvatar: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  avatarImage: {
    width: '122.59px',
    height: '107.42px',
    background: '#fff',
    borderRadius: '50%',
    marginLeft: '10px',
  },
  name: {
    fontFamily: 'Montserrat',
    fontSize: '30px',
    marginLeft: '12px',
  },
  arrowBack: {
    marginLeft: '30px',
    cursor: 'pointer',
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: '38px',
    textAlign: 'center',
    marginBottom: '40px',
  },
  centerInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
  },
  examInput: {
    fontFamily: 'Montserrat',
    fontSize: '25px',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '10px',
    marginTop: '30px',
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
    marginTop: '15px',
    textAlign: 'center',
    marginBottom: '30px',
    textTransform: 'capitalize',
  },
  centerInputDate: {
    margin: '0 auto',
    width: '35%',
  },
}));

const AddPrescription = ({
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  const [prescription, setPrescription] = useState('');
  const [date, setDate] = useState('');

  const [hasFile, setHasFile] = useState(false);
  const [pdf, setPdf] = useState(undefined);
  const [filetype, setFileType] = useState('');
  const fileInput = useRef(null);
  const [inputLabel, setInputLabel] = useState('');
  const [loading, setLoading] = useState(false);

  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');

  let avatar = useLocation().state;

  const historyBack = useHistory();
  const goBack = () => historyBack.goBack();

  function onSubmit() {

    setLoading(true);

    let bodyFormData = new FormData();
    bodyFormData.append('titulo', prescription);
    bodyFormData.append('data', date);
    bodyFormData.append('avatar', avatar.id);
    bodyFormData.append('arquivo', pdf);

    axios({
      method: 'post',
      url: 'https://clinicalbook.polijrinternal.com/web/receitas/',
      headers: {
        'Authorization': `Token ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      data: bodyFormData,
    })
      .then(function () {
        goBack();
      })
      .catch(
        function (error) {
        setLoading(false);
        console.log(error);
        }
      );
  }

  const onFileChange = (e) => {
    const fileObj = e.target.files[0];
    const reader = new FileReader();

    setFileType(fileObj.type);
    setInputLabel(fileObj.name);

    reader.onload = () => {

      setPdf(fileObj);
      setHasFile(true);
    };
    reader.readAsDataURL(fileObj);
  };


  return (
    <div className={classes.container}>
      <HeaderGreen />

      <div className={classes.containerAvatar}>
        <Button
          onClick={goBack}
          className={classes.arrowBack}>
          <KeyboardBackspaceIcon
            style={{ fontSize: 70, color: '#3AAC9E' }}
          />
        </Button>

        <div className={classes.item}>
          <img src={avatar.foto} alt="" className={classes.avatarImage} />
        </div>

        <Typography className={classes.name}>{avatar.nome} {avatar.sobrenome}</Typography>
      </div>

      <Typography className={classes.subTitle}>Adicione uma nova receita</Typography>

      {loading ? (
        <div className={classes.centerInput}>
          <CircularProgress color="#3AAC9E" />
        </div>

      ) : (
          <>
            <Input
              width="35%"
              id="prescription"
              name="prescription"
              placeholder="Receita"
              value={prescription}
              type="text"
              onChange={({ target: { value } }) => setPrescription(value)}
            />

            <div className={classes.centerInputDate}>
              <InputDate
                width="35%"
                id="date"
                name="date"
                placeholder="dd/mm/aaaa"
                label="Data"
                value={date}
                onChange={({ target: { value } }) => setDate(value)}
              />
            </div>

            <Typography className={classes.examInput}>Arquivo da receita:</Typography>

            <div className={classes.centerInput}>
              <InputFile onChange={onFileChange} inputLabel={inputLabel} />
            </div>

            <div className={classes.centerInput}>
              <Button
                type="submit"
                className={classes.submit}
                onClick={onSubmit}
              >
                {authRequesting ? (
                  <CircularProgress color="white" />
                ) : ('Salvar')}
              </Button>
            </div>
          </>

        )}
    </div>
  );
};

AddPrescription.propTypes = {
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
)(AddPrescription);
