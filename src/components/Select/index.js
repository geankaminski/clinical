import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import NumberFormat from 'react-number-format';

import {
  withStyles,
} from '@material-ui/core';

const styles = () => ({
  inputDefault: {
    background: 'none',
    paddingLeft: 7,
    height: props => props.height,
    width: props => props.width,
    borderBottom: '1px solid #000000',
    backgroundColor: 'none',
    outline: 0,
    fontFamily: 'Montserrat',
    fontSize: '20px',
    color: '#000000',
    borderWidth: '0 0 2px',
    marginBottom: '20px',
    marginTop: '15px',
    '&::placeholder': {
      fontFamily: 'Montserrat',
      color: '#000000',
      fontSize: '24px',
      backgroundColor: 'transparent',
    },
    '&::option': {
      background: 'none',
      fontFamily: 'Montserrat',
      fontSize: '24px',
    },
  },
});

function CustomMaskedInput(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      allowEmptyFormatting
    />
  );
}

const Select = ({
  label,
  value,
  error,
  onChange,
  required,
  helperText,
  type,
  classes,
  masked,
  placeholder,
  maxLength,
  ...other
}) => {
  return (
    <select
      {...other}
      type={type}
      maxLength={maxLength}
      required={required}
      value={value}
      error={error}
      onChange={onChange}
      placeholder={placeholder}
      className={classes.inputDefault}
      inputComponent={masked ? CustomMaskedInput : this}
    />
  );
};

CustomMaskedInput.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

CustomMaskedInput.defaultProps = {
  inputRef: noop,
};

Select.propTypes = {
  classes: PropTypes.shape({
    inputDefault: PropTypes.string,
    inputLabel: PropTypes.string,
  }).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
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

Select.defaultProps = {
  label: '',
  value: '',
  error: false,
  required: false,
  helperText: '',
  type: 'text',
  other: {},
  fullWidth: false,
  onChange: noop,
  masked: false,
  maxLength: '',
  placeholder: '',
  height: null,
  width: null,
};

export default withStyles(styles)(Select);
