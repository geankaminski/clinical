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

const EditReport = ({
  history,
  authRequesting,
}) => {
  const classes = useStyles();

  let reportInfo = useLocation().state;
  const [report, setReport] = useState(reportInfo.titulo);
  const [date, setDate] = useState(reportInfo.data);
  const [category, setCategory] = useState(reportInfo.categoria);

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
    bodyFormData.append('titulo', report);
    bodyFormData.append('data', date);
    bodyFormData.append('categoria', category);
    //bodyFormData.append('arquivo', pdf);

    axios({
      method: 'patch',
      url: `https://clinicalbook.polijrinternal.com/web/relatorios/${reportInfo.id}/`,
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
          <img src={reportInfo.foto} alt="" className={classes.avatarImage} />
        </div>

        <Typography className={classes.name}>{reportInfo.avatarNome} {reportInfo.avatarSobrenome}</Typography>
      </div>

      <Typography className={classes.subTitle}>Editar relatório</Typography>

      <Input
        width="35%"
        id="report"
        name="report"
        placeholder="Título do Relatório"
        value={report}
        type="text"
        onChange={({ target: { value } }) => setReport(value)}
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

      <div className={classes.centerInput}>
        <Select
          width="35%"
          height={30}
          id="category"
          value={category}
          onChange={({ target: { value } }) => setCategory(value)}
        >
          <option value="" disabled selected>Categoria</option>
          <option value="cardiopulmonar">Cardiopulmonar</option>
          <option value="endocrino">Endócrino</option>
          <option value="gastro">Gastro</option>
          <option value="ginecologia">Ginecologia</option>
          <option value="hemato">Hemato</option>
          <option value="neurologia">Neurologia</option>
          <option value="oftalmologia">Oftalmologia</option>
          <option value="ortopedia">Ortopedia</option>
          <option value="otorrino">Otorrino</option>
          <option value="outros">Outros</option>
        </Select>
      </div>

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

EditReport.propTypes = {
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
  setDisplayName('EditReport'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(EditReport);
