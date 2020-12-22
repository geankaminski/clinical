import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import {
  withStyles,
} from '@material-ui/core';

const styles = () => ({
  inputDefault: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  label: {
    width: '151px',
    height: '38px',
    background: '#3AAC9E',
    cursor: 'pointer',
    padding: '11px 10px 11px 10px',
    color: 'white',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    fontSize: '16px',
  },
  fileData: {
    marginRight: 10,
    width: '15%',
    height: '38px',
    border: '1px solid rgba(0, 0, 0, 0.5)',
  },
});

const InputFile = ({
  label,
  value,
  error,
  inputLabel,
  onChange,
  required,
  helperText,
  type,
  ref,
  classes,
  masked,
  placeholder,
  maxLength,
  name,
  ...other
}) => {
  return (
    <>
      <input className={classes.fileData} type="text" value={inputLabel} disabled />
      <label htmlFor="file" className={classes.label}>Selecionar</label>
      <input className={classes.inputDefault} type="file" id="file" ref={ref} onChange={onChange} />
    </>
  );
};


InputFile.propTypes = {
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

InputFile.defaultProps = {
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

export default withStyles(styles)(InputFile);
