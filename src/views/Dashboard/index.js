import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { curry, get as lodashGet } from 'lodash';
import axios from 'axios';
import { isMobile } from 'helpers/utils';

import { 
        HeaderGreen, 
        ButtonGreen, 
        ExamsLink, 
        PrescriptionLink, 
        ReportLink,
        VaccineLink
      } from 'components';

import { default as avatarImg } from 'assets/img/avatar-img.svg';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  arrowBack: {
    marginLeft: '30px',
    cursor: 'pointer',
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
  containerAvatar: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  containerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  arrowForward: {
    position: 'absolute',
    right: '20px',
    top: '60%',
  },
  arrowBackward: {
    position: 'absolute',
    left: '20px',
    top: '70%',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: '50px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    width: '50%',
    flexDirection: 'column',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    width: '50%',
    flexDirection: 'column',
  },
  button: {
    marginBottom: '60px',
  },
  buttonStyle: {
    background: '#3AAC9E',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    width: '282px',
    height: '62px',
    color: "#fff",
    textAlign: 'center',
    textTransform: 'none',
    marginBottom: '60px',
  },
  container: {
  
  },
  pagination : {
    marginBottom: '30px',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [view, setView] = useState(true);
  const [pagePrescription, setPagePrescription] = React.useState(1);
  const [pageExam, setPageExam] = React.useState(1);
  const [pageReport, setPageReport] = React.useState(1);
  const [pageVaccine, setPageVaccine] = React.useState(1);

  const [exams, setExams] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');

  let avatar = useLocation().state;

  useEffect(() => {
    getExam();
  }, []);

  let getExam = async () => {
    let exames = await axios.get(`https://clinicalbook.polijrinternal.com/web/exames/?avatar_id=${avatar.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    let receitas = await axios.get(`https://clinicalbook.polijrinternal.com/web/receitas/?avatar_id=${avatar.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    let relatorios = await axios.get(`https://clinicalbook.polijrinternal.com/web/relatorios/?avatar_id=${avatar.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    let vacinas = await axios.get(`https://clinicalbook.polijrinternal.com/web/vacinas/?avatar_id=${avatar.id}`, {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    setExams(exames.data);
    setPrescriptions(receitas.data);
    setReports(relatorios.data);
    setVaccines(vacinas.data);
  }

  function handlePageFalse() {
    setView(false);
  }

  function handlePageTrue() {
    setView(true);
  }

  return (
    <div className={classes.container}>
      <HeaderGreen />

      <div className={classes.containerAvatar}>
        <Button
          to="/usuarios"
          component={Link}
          className={classes.arrowBack}>
          <KeyboardBackspaceIcon
            style={{ fontSize: 70, color: '#3AAC9E' }}
          />
        </Button>

        <div >
          <img src={avatarImg} alt="" className={classes.avatarImage} />
        </div>

        <Typography className={classes.name}>{avatar.nome} {avatar.sobrenome}</Typography>
      </div>

      {view
        ? (
          <div className={classes.containerContent}>
            <div className={classes.arrowForward}>
              <Button
                onClick={handlePageFalse}
              >
                <ArrowForwardIcon
                  style={{ fontSize: 70, color: '#3AAC9E' }}
                />
              </Button>
            </div>
            <div className={classes.leftContainer}>
              <Typography className={classes.title}>Exames</Typography>

              <Button
                component={Link}
                to={{
                  pathname: `/adicionar-exame`,
                  state: {
                    id: `${avatar.id}`,
                    nome: `${avatar.nome}`,
                    sobrenome: `${avatar.sobrenome}`,
                    foto: `${avatar.foto}`,
                  }
                }}
                className={classes.buttonStyle}
              >
                Adicionar exame
                </Button>

              {exams.slice(((pageExam - 1)*(5)), ((pageExam)*(5)  )).map(exam => {
                return (
                  <ExamsLink    
                    avatar={exam.avatar}
                    id={exam.id}
                    key={exam.id}
                    name={exam.titulo_exame}
                    date={exam.data_exame}
                    lab={exam.laboratorio}
                    nome={avatar.nome}
                    sobrenome={avatar.sobrenome}
                    foto={avatar.foto}
                  />
                  
                )
              })}

              <Pagination className={classes.pagination} count={exams.length < 5 ? 1 : (exams.length%5===0 ? exams.length/5 : parseInt(exams.length/5 + 1)) } page={pageExam} onChange={(event,val)=> setPageExam(val)} />
            </div>

            <div className={classes.rightContainer}>
              <Typography className={classes.title}>Receitas</Typography>

              <Button
                component={Link}
                to={{
                  pathname: `/adicionar-receita`,
                  state: {
                    id: `${avatar.id}`,
                    nome: `${avatar.nome}`,
                    sobrenome: `${avatar.sobrenome}`,
                    foto: `${avatar.foto}`,
                  }
                }}
                className={classes.buttonStyle}
              >
                Adicionar receita
                </Button>


                {prescriptions.slice(((pagePrescription - 1)*(5)), ((pagePrescription)*(5)  )).map(prescription => {
                return (
                  <PrescriptionLink    
                    avatar={prescription.avatar}
                    id={prescription.id}
                    key={prescription.id}
                    name={prescription.titulo}
                    date={prescription.data}
                    nome={avatar.nome}
                    sobrenome={avatar.sobrenome}
                    foto={avatar.foto}
                  />
                )
              })}
               <Pagination className={classes.pagination} count={prescriptions.length < 5 ? 1 : (prescriptions.length%5===0 ? prescriptions.length/5 : parseInt(prescriptions.length/5 + 1)) } page={pagePrescription} onChange={(event,val)=> setPagePrescription(val)}   />

            </div>
          </div>
        )
        : (
          <div className={classes.containerContent}>
            <div className={classes.arrowBackward}>
              <Button
                onClick={handlePageTrue}
              >
                <ArrowBackIcon
                  style={{ fontSize: 70, color: '#3AAC9E' }}
                />
              </Button>
            </div>
            <div className={classes.leftContainer}>
              <Typography className={classes.title}>Relatórios</Typography>

              <Button
                component={Link}
                to={{
                  pathname: `/adicionar-relatorio`,
                  state: {
                    id: `${avatar.id}`,
                    nome: `${avatar.nome}`,
                    sobrenome: `${avatar.sobrenome}`,
                    foto: `${avatar.foto}`,
                  }
                }}
                className={classes.buttonStyle}
              >
                Adicionar relatório
                </Button>


                {reports.slice(((pageReport - 1)*(5)), ((pageReport)*(5)  )).map(report => {
                return (
                  <ReportLink    
                    avatar={report.avatar}
                    id={report.id}
                    key={report.id}
                    name={report.titulo}
                    date={report.data}
                    nome={avatar.nome}
                    sobrenome={avatar.sobrenome}
                    foto={avatar.foto}
                  />
                )
              })}
              <Pagination className={classes.pagination} count={reports.length < 5 ? 1 : (reports.length%5===0 ? reports.length/5 : parseInt(reports.length/5 + 1)) } page={pageReport} onChange={(event,val)=> setPageReport(val)}   />

            </div>

            <div className={classes.rightContainer}>
              <Typography className={classes.title}>Vacinas</Typography>

              <Button
                component={Link}
                to={{
                  pathname: `/adicionar-vacina`,
                  state: {
                    id: `${avatar.id}`,
                    nome: `${avatar.nome}`,
                    sobrenome: `${avatar.sobrenome}`,
                    foto: `${avatar.foto}`,
                  }
                }}
                className={classes.buttonStyle}
              >
                Adicionar vacina
                </Button>

                {vaccines.slice(((pageVaccine - 1)*(5)), ((pageVaccine)*(5)  )).map(vaccine => {
                return (
                  <VaccineLink    
                    avatar={vaccine.avatar}
                    id={vaccine.id}
                    key={vaccine.id}
                    name={vaccine.tipo_vacina}
                    validade={vaccine.data_validade}
                    dose={vaccine.dose}
                    date={vaccine.data}
                    nome={avatar.nome}
                    sobrenome={avatar.sobrenome}
                    foto={avatar.foto}
                  />
                )
              })}

              <Pagination  className={classes.pagination}count={vaccines.length < 5 ? 1 : (vaccines.length%5===0 ? vaccines.length/5 : parseInt(vaccines.length/5 + 1)) } page={pageVaccine} onChange={(event,val)=> setPageVaccine(val)}   />

            </div>
          </div>
        )
      }


    </div>
  );
}
