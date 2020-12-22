import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  buttonBase: {
    background: '#3AAC9E',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    width: '180px',
    height: '44px',
    color: "#fff",
    textAlign: 'center',
    textTransform: 'capitalize',
    cursor: 'pointer',
    margin: 0,
  },
}));

const ButtonGreen = () => {
  const classes = useStyles();
  return (
    <button className={classes.buttonBase} />
  );
};

export default ButtonGreen;
