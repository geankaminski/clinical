import React, { useState, useRef } from 'react';
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
  },
  submit: {
    background: '#3AAC9E',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    width: '180px',
    height: '44px',
    marginBottom: '30px',
    color: "#fff",
    marginTop: '15px',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  centerInputDate: {
    margin: '0 auto',
    width: "35%",
  },
}));

const AddVaccine = ({
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  const [vaccine, setVaccine] = useState('');
  const [date, setDate] = useState('');
  const [dose, setDose] = useState('');
  const [validity, setValidity] = useState('');
  const [validityDate, setValidityDate] = useState(null);

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
    bodyFormData.append('tipo_vacina', vaccine);
    bodyFormData.append('data', date);
    bodyFormData.append('data_validade', validityDate);
    bodyFormData.append('dose', dose);
    bodyFormData.append('avatar', avatar.id);
    bodyFormData.append('arquivo', pdf);

    axios({
      method: 'post',
      url: 'https://clinicalbook.polijrinternal.com/web/vacinas/',
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
      setHasFile(true);
      setPdf(fileObj);
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

      <Typography className={classes.subTitle}>Adicione uma nova vacina</Typography>

      {loading ? (
        <div className={classes.centerInput}>
          <CircularProgress color="#3AAC9E" />
        </div>

      ) : (
          <>

            <Input
              width="35%"
              id="vaccine"
              name="vaccine"
              placeholder="Nome da Vacina"
              value={vaccine}
              type="text"
              onChange={({ target: { value } }) => setVaccine(value)}
            />

            <div className={classes.centerInputDate}>
              <InputDate
                width="35%"
                id="date"
                name="date"
                placeholder="dd/mm/aaaa"
                label="Data de Aplicação"
                value={date}
                onChange={({ target: { value } }) => setDate(value)}
              />
            </div>

            <div className={classes.centerInput}>
              <Select
                width="35%"
                height={30}
                id="dose"
                value={dose}
                onChange={({ target: { value } }) => setDose(value)}
              >
                <option value="" disabled selected>Dosagem</option>
                <option value="unica">Única</option>
                <option value="primeira">Primeira Dose</option>
                <option value="segunda">Segunda Dose</option>
                <option value="terceira">Terceira Dose</option>
                <option value="reforco">Reforço</option>
              </Select>
            </div>

            <div className={classes.centerInput}>
              <Select
                width="35%"
                height={30}
                id="validity"
                value={validity}
                onChange={({ target: { value } }) => setValidity(value)}
              >
                <option value="" disabled selected>Possui data de validade?</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </Select>
            </div>

            {validity === "sim" && (
              <div className={classes.centerInputDate}>
                <InputDate
                  width="35%"
                  id="validity-date"
                  name="validity-date"
                  placeholder="dd/mm/aaaa"
                  label="Data de Validade"
                  value={validityDate}
                  onChange={({ target: { value } }) => setValidityDate(value)}
                />
              </div>
            )}

            <Typography className={classes.examInput}>Arquivo da vacina:</Typography>

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

AddVaccine.propTypes = {
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
  setDisplayName('AddVaccine'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(AddVaccine);
