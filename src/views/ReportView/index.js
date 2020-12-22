import React, { useState, useEffect } from 'react';
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
import { Document, Page, pdfjs  } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { default as avatarImg } from 'assets/img/avatar-img.svg';
import { Input, HeaderGreen, Select, InputFile } from 'components';

import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
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
  title: {
    fontFamily: 'Montserrat',
    fontSize: '50px',
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: '29px',
    textAlign: 'center',
  },
  date: {
    fontFamily: 'Montserrat',
    fontSize: '24px',
    color: '#757575',
    textTransform: 'capitalize',
  },
  centerInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
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
  delete: {
    background: 'none',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    width: '180px',
    height: '44px',
    color: "red",
    marginTop: '15px',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginLeft: '30px',
  },
  anexo: {
    textDecoration: 'none',
  }, 
}));

const ReportView = ({
  history,
  authRequesting,
}) => {
  const classes = useStyles();

  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');
  let reportInfo = useLocation().state;

  const [report, setReport] = useState({});
  const [file, setFile] = useState([]);

  useEffect(() => {
    getReport();
  }, []);

  let getReport = async () => {
    let res = await axios.get(`https://clinicalbook.polijrinternal.com/web/relatorios/?avatar_id=${reportInfo.avatar}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    res.data.map(item => {
      if (item.id === reportInfo.id) {
        setReport(item);
      }
    });
    let arquivo = await axios.get(`https://clinicalbook.polijrinternal.com/web/anexos-relatorios/?relatorio_id=${reportInfo.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    setFile(arquivo.data);
  }

  const handleDelete = async () => {
    await axios.delete(`https://clinicalbook.polijrinternal.com/web/relatorios/${reportInfo.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    goBack();
  }

  const historyBack = useHistory();
  const goBack = () => historyBack.goBack();

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

        <Typography className={classes.name}>{reportInfo.nome} {reportInfo.sobrenome}</Typography>
      </div>

      <Typography className={classes.title}>{report.titulo}</Typography>
      <Typography className={classes.subTitle}>Data:<span className={classes.date}> {report.data}</span></Typography>
      <Typography className={classes.subTitle}>Categoria<span className={classes.date}> {report.categoria}</span></Typography>

      <div className={classes.centerInput}>
        <Button
          to={{
            pathname: `/editar-relatorio`,
            state: {
              id: `${report.id}`,
              titulo: `${report.titulo}`,
              data: `${report.data}`,
              categoria: `${report.categoria}`,
              avatarNome: `${reportInfo.nome}`,
              foto: `${reportInfo.foto}`,
              avatarSobrenome: `${reportInfo.sobrenome}`,
            }
          }}
          component={Link}
          className={classes.submit}
        >
          Editar
        </Button>

        <Button
          onClick={handleDelete}
          type="submit"
          className={classes.delete}
        >
          Apagar
        </Button>
      </div>

      <div className={classes.centerInput}>
        <Button
          to={{
            pathname: `/visualizar-arquivo`,
            state: {
              file: file,
              nome: `${reportInfo.nome}`,
              foto: `${reportInfo.foto}`,
              sobrenome: `${reportInfo.sobrenome}`,
            }
          }}
          component={Link}
          className={classes.submit}
          style={{ marginBottom: '30px' }}
        >
          Arquivo
        </Button>
      </div>

    </div>
  );
};

ReportView.propTypes = {
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
  setDisplayName('ReportView'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(ReportView);
