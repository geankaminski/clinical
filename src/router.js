/* eslint-disable react/display-name */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthorizationHandler from 'components/AuthorizationHandler';
// import GlobalNotification from 'components/GlobalNotification';
// import App from './components/App';

import Signup from './views/Signup';
import SignIn from './views/SignIn';
import SelectUser from './views/SelectUser';
import RegisterUser from './views/RegisterUser';
import Dashboard from './views/Dashboard';
import TokenPage from './views/TokenPage';
import AddExam from './views/AddExam';
import ExamView from './views/ExamView';
import EditExam from './views/EditExam';
import AddPrescription from './views/AddPrescription';
import PrescriptionView from './views/PrescriptionView';
import EditPrescription from './views/EditPrescription';
import AddReport from './views/AddReport';
import ReportView from './views/ReportView';
import EditReport from './views/EditReport';
import AddVaccine from './views/AddVaccine';
import VaccineView from './views/VaccineView';
import EditVaccine from './views/EditVaccine';
import ResetPwd from './views/ResetPwd';
import FileView from './views/FileView';

const AuthorizedRoutes = props => (
  <AuthorizationHandler {...props}>
    {/* <App {...props}> */}
    <Switch>
      <Route path="/dashboard/:id" component={Dashboard} />
      <Route path="/adicionar-exame" component={AddExam} />
      <Route path="/visualizar-exame" component={ExamView} />
      <Route path="/editar-exame" component={EditExam} />
      <Route path="/editar-receita" component={EditPrescription} />
      <Route path="/usuarios" component={SelectUser} />
      <Route path="/visualizar-receita" component={PrescriptionView} />
      <Route path="/cadastro" component={RegisterUser} />
      <Route path="/adicionar-receita" component={AddPrescription} />
      <Route path="/adicionar-relatorio" component={AddReport} />]
      <Route path="/visualizar-relatorio" component={ReportView} />
      <Route path="/editar-relatorio" component={EditReport} />
      <Route path="/adicionar-vacina" component={AddVaccine} />
      <Route path="/visualizar-vacina" component={VaccineView} />
      <Route path="/editar-vacina" component={EditVaccine} />
      <Route path="/visualizar-arquivo" component={FileView} />
    </Switch>
    {/* </App> */}
  </AuthorizationHandler>
);

export default () => (
  <BrowserRouter>
    {/* <GlobalNotification /> */}
    <Switch>
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={SignIn} />
      <Route path="/token" component={TokenPage} />
      <Route path="/recuperar-senha" component={ResetPwd} />
      <Route path="*" component={AuthorizedRoutes} />
    </Switch>
  </BrowserRouter>
);
