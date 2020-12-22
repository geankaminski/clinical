import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter, Link, useHistory, useLocation } from 'react-router-dom';
import { setDisplayName, compose } from 'recompose';
import { selectState, getRequestingSelector } from 'redux/selectors';
import immutableToJS from 'helpers/immutableToJS';
import { signup } from 'redux/auth/actions';
import { setGlobalNotification } from 'redux/ui/actions';
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
    textTransform: 'capitalize',
  },
  centerInputDate: {
    margin: '0 auto',
    width: "35%",
  },
}));

const EditVaccine = ({
  history,
  authRequesting,
}) => {
  const classes = useStyles();

  let vaccineInfo = useLocation().state;
  const [vaccine, setVaccine] = useState(vaccineInfo.titulo);
  const [date, setDate] = useState(vaccineInfo.data);
  const [dose, setDose] = useState(vaccineInfo.dose);
  const [validity, setValidity] = useState(vaccineInfo.validityDate !== null ? 'sim' : 'nao');
  const [validityDate, setValidityDate] = useState(vaccineInfo.validityDate);

  const [hasFile, setHasFile] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [filetype, setFileType] = useState('');
  const fileInput = useRef(null);
  const [inputLabel, setInputLabel] = useState('');

  const historyBack = useHistory();
  const goBack = () => historyBack.goBack();

  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');

  function onSubmit() {

    let bodyFormData = new FormData();
    bodyFormData.append('tipo_vacina', vaccine);
    bodyFormData.append('data', date);
    bodyFormData.append('dose', dose);
    bodyFormData.append('data_validade', validityDate);
    //bodyFormData.append('arquivo', pdf);

    axios({
      method: 'patch',
      url: `https://clinicalbook.polijrinternal.com/web/vacinas/${vaccineInfo.id}/`,
      headers: {
        'Authorization': `Token ${accessToken}`,
      },
      data: bodyFormData,
    })
      .then(function () {
        goBack();
      });
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
          <img src={vaccineInfo.foto} alt="" className={classes.avatarImage} />
        </div>

        <Typography className={classes.name}>{vaccineInfo.avatarNome} {vaccineInfo.avatarSobrenome}</Typography>
      </div>

      <Typography className={classes.subTitle}>Editar vacina</Typography>

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
          placeholder="DD/MM/AAAA"
          label="Data"
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

      <Typography className={classes.examInput}>Arquivo do exame:</Typography>

      <div className={classes.centerInput}>
        <InputFile onChange={onFileChange} inputLabel={inputLabel} />
      </div>

      <div className={classes.centerInput}>
        <Button
          type="submit"
          className={classes.submit}
          onClick={onSubmit}
          style={{ marginBottom: '30px' }}
        >
          {authRequesting ? (
            <CircularProgress color="white" />
          ) : ('Salvar')}
        </Button>
      </div>

    </div>
  );
};

EditVaccine.propTypes = {
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
  setGlobalNotification: payload => dispatch(setGlobalNotification(payload)),
});

export default compose(
  setDisplayName('EditVaccine'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(EditVaccine);
