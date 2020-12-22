import React, { useState } from 'react';
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
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'left',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '10px',
  },
  labelDefault: {
    fontFamily: 'Montserrat',
    color: 'black',
    fontSize: '20px',
    textAlign: 'left',
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

const InputDate = ({
  label,
  value,
  error,
  onChange,
  required,
  helperText,
  type,
  classes,
  masked,
  id,
  placeholder,
  maxLength,
  ...other
}) => {

  const [dateView, setDateView] = useState(false);

  const onFocus = () => {
    setDateView(true);
  }

  const onBlur = () => {
    setDateView(false);
  }

  return (
    <div className={classes.inputContainer}>
      {label && (
        <label className={classes.labelDefault}  htmlFor={id}>{label}</label>
      )}
      <input
        {...other}
        type={dateView ? 'date' : 'text'}
        maxLength={maxLength}
        required={required}
        value={value}
        error={error}
        id={id}
        onFocus={onFocus}
        onBlur={onBlur}
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

InputDate.propTypes = {
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
  id: PropTypes.string,
};

InputDate.defaultProps = {
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

export default withStyles(styles)(InputDate);
