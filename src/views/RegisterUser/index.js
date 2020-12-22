import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter, Link } from 'react-router-dom';
import { selectState, getRequestingSelector } from 'redux/selectors';
import immutableToJS from 'helpers/immutableToJS';
import { setDisplayName, compose } from 'recompose';

import { avatar } from 'redux/auth/actions';

import { Input, Select, InputFile, InputDate } from 'components';

import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  arrowBack: {
    marginTop: '70px',
    marginLeft: '30px',
    cursor: 'pointer',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: '38px',
    textAlign: 'center',
    marginBottom: '40px',
  },
  centerInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: "#fff",
    marginTop: '15px',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: '30px',
  },
  textPhoto: {
    fontFamily: 'Montserrat',
    fontSize: '30px',
    textAlign: 'center',
    marginTop: '50px',
    marginBottom: '20px',
  },
  container: {
    background: 'linear-gradient(to bottom, #feffff, #d3f0ed)',
  },
}));

const RegisterUser = ({
  avatar,
  history,
  authRequesting,
}) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bday, setBday] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [healthPlan, setHealthPlan] = useState('');

  const [hasFile, setHasFile] = useState(false);
  const [avatarImg, setAvatarImg] = useState(null);
  const [filetype, setFileType] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const fileInput = useRef(null);

  const [dateView, setDateView] = useState(false);

  const onFileChange = (e) => {
    const fileObj = e.target.files[0];
    const reader = new FileReader();

    setFileType(fileObj.type);
    setInputLabel(fileObj.name);

    reader.onload = () => {
      setAvatarImg(reader.result);
      setHasFile(true);
      console.log(reader.result)
    };
    reader.readAsDataURL(fileObj);
  };

  const onSubmit = () => {
    avatar({
      nome: firstName,
      sobrenome: lastName,
      foto: avatarImg,
      data_nascimento: bday,
      sexo: gender,
      altura: height,
      peso: weight,
      tipo_sanguineo: bloodType,
      plano_de_saude: healthPlan === '' ? '-' : healthPlan,
      onSuccess: () => {
        history.push('/usuarios');
      },
      onFailure: () => {
        console.log('falhou')
      },
    });
  };

  const onFocus = () => {
    setDateView(true);
  }

  const onBlur = () => {
    setDateView(false);
  }

  return (
    <div className={classes.container}>
      <Button
        to="/usuarios"
        component={Link}
        className={classes.arrowBack}>
        <KeyboardBackspaceIcon
          style={{ fontSize: 70, color: '#3AAC9E' }}
        />
      </Button>

      <Typography className={classes.title}>Adicione um novo familiar</Typography>

      <div className={classes.centerInput}>
        <Input
          width="595.49px"
          height="30px"
          placeholder="Nome"
          value={firstName}
          name="name"
          type="text"
          id="name"
          onChange={({ target: { value } }) => setFirstName(value)}
        />
      </div>

      <div className={classes.centerInput}>
        <Input
          width="595.49px"
          height="30px"
          placeholder="Sobrenome"
          value={lastName}
          name="lastname"
          type="text"
          id="lastname"
          onChange={({ target: { value } }) => setLastName(value)}
        />
      </div>

      <div className={classes.centerInput}>
        <InputDate
          width="595.49px"
          height="30px"
          id="bday"
          name="bday"
          placeholder="Data de nascimento"
          value={bday}
          onChange={({ target: { value } }) => setBday(value)}
        />
      </div>

      <div className={classes.centerInput}>
        <Select
          width="595.49px"
          height="30px"
          id="gender"
          value={gender}
          onChange={({ target: { value } }) => setGender(value)}
        >
          <option value="" disabled selected>Sexo</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </Select>
      </div>

      <div className={classes.centerInput}>
        <Input
          width="595.49px"
          height="30px"
          id="height"
          name="height"
          placeholder="Altura (cm)"
          value={height}
          type="number"
          onChange={({ target: { value } }) => setHeight(value)}
        />
      </div>

      <div className={classes.centerInput}>
        <Input
          width="595.49px"
          height="30px"
          id="weight"
          name="weight"
          placeholder="Peso (kg)"
          value={weight}
          type="number"
          onChange={({ target: { value } }) => setWeight(value)}
        />
      </div>

      <div className={classes.centerInput}>
        <Select
          width="595.49px"
          height="30px"
          id="blood"
          value={bloodType}
          onChange={({ target: { value } }) => setBloodType(value)}
        >
          <option value="" disabled>Tipo Sanguíneo</option>
          <option value="o-">O-</option>
          <option value="o+">O+</option>
          <option value="a-">A-</option>
          <option value="a+">A+</option>
          <option value="b-">B-</option>
          <option value="b+">B+</option>
          <option value="ab-">AB-</option>
          <option value="ab+">AB+</option>
        </Select>
      </div>

      <div className={classes.centerInput}>
        <Input
          width="595.49px"
          height="30px"
          placeholder="Plano de Saúde (Opcional)"
          value={healthPlan}
          name="healthPlan"
          type="text"
          id="healthPlan"
          onChange={({ target: { value } }) => setHealthPlan(value)}
        />
      </div>

      <Typography className={classes.textPhoto}>Selecione uma foto:</Typography>

      <div className={classes.centerInput}>
        <InputFile onChange={onFileChange} ref={fileInput} inputLabel={inputLabel} />
      </div>

      <div className={classes.centerInput}>
        <Button
          type="submit"
          variant="contained"
          className={classes.submit}
          onClick={onSubmit}
        >
          Salvar
        </Button>
      </div>

    </div>

  );
};

RegisterUser.propTypes = {
  avatar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setGlobalNotification: PropTypes.func.isRequired,
  authRequesting: PropTypes.bool,
};

const mapStateToProps = state => ({
  //...selectState('auth', 'tokenInfo')(state, 'tokenInfo'),
  authRequesting: getRequestingSelector('auth', 'tokenInfo')(state),
});

const mapDispatchToProps = dispatch => ({
  avatar: payload => dispatch(avatar(payload)),
  setGlobalNotification: payload => dispatch(setGlobalNotification(payload)),
});

export default compose(
  setDisplayName('RegisterUser'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  immutableToJS,
  withRouter,
)(RegisterUser);

