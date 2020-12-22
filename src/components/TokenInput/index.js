import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import axios from 'axios';

import {
  withStyles,
} from '@material-ui/core';

const styles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  inputDefault: {
    width: '207px',
    height: '38px',
  },
  buttonDefault: {
    width:  '151px',
    height: '38px',
    background: '#3AAC9E',
    marginLeft: '11px',
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '20px',
    cursor: 'pointer',
    border: 0,
  },
});

const TokenInput = ({
  label,
  value,
  error,
  onClick,
  required,
  helperText,
  type,
  ref,
  classes,
  masked,
  placeholder,
  maxLength,
  ...other
}) => {

  const [token, setToken] = useState('');

  let onSubmit = async () => {
    let exame = await axios.get(`https://clinicalbook.polijrinternal.com/api/acessar-exame/${token}`, {});
    let relatorio = await axios.get(`https://clinicalbook.polijrinternal.com/api/acessar-relatorio/${token}`, {});
    let vacina = await axios.get(`https://clinicalbook.polijrinternal.com/api/acessar-vacina/${token}`, {});
    let receita = await axios.get(`https://clinicalbook.polijrinternal.com/api/acessar-receita/${token}`, {});

    console.log(exame, relatorio, vacina, receita);
  }

  return (
    <div className={classes.container} >
      <input 
        className={classes.inputDefault} 
        type="text" 
        value={token}
        onChange={({ target: { value } }) => setToken(value)}
      />
      <button type="submit" className={classes.buttonDefault} onClick={onSubmit}>Ir</button>
    </div>
  );
};


TokenInput.propTypes = {
  classes: PropTypes.shape({
    inputDefault: PropTypes.string,
    inputLabel: PropTypes.string,
  }).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  onClick: PropTypes.func,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string,
  other: PropTypes.shape({}),
  fullWidth: PropTypes.bool,
  masked: PropTypes.bool,
  maxLength: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

TokenInput.defaultProps = {
  label: '',
  value: '',
  error: false,
  required: false,
  helperText: '',
  type: 'text',
  other: {},
  fullWidth: false,
  onClick: noop,
  masked: false,
  maxLength: '',
  placeholder: '',
  height: null,
  width: null,
};

export default withStyles(styles)(TokenInput);
