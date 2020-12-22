import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import NumberFormat from 'react-number-format';

import {
  withStyles,
} from '@material-ui/core';

const styles = () => ({
  inputDefault: {
    paddingLeft: 7,
    height: 30,
    width: props => props.width,
    borderBottom: '1px solid #000000',
    backgroundColor: 'transparent',
    outline: 0,
    fontFamily: 'Montserrat',
    color: 'black',
    fontSize: '20px',
    borderWidth: '0 0 2px',
    marginBottom: '20px',
    '&::placeholder': {
      fontFamily: 'Montserrat',
      color: 'black',
      fontSize: '20px',
      opacity: 1,
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
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

const Input = ({
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
    <div className={classes.inputContainer}>
      <input
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
     
    </div>
  );
};

CustomMaskedInput.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

CustomMaskedInput.defaultProps = {
  inputRef: noop,
};

Input.propTypes = {
  classes: PropTypes.shape({
    inputDefault: PropTypes.string,
    inputLabel: PropTypes.string,
    inputContainer: PropTypes.string,
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

Input.defaultProps = {
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

export default withStyles(styles)(Input);
