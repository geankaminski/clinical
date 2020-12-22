import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Header, TokenInput } from 'components';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },
  text: {
    marginTop: '300px',
    fontFamily: 'Montserrat',
    fontSize: '25px',
    lineHeight: '37px',
    marginBottom: '10px',
    paddingRight: '140px',
  },
  input: {
    textAlign: 'center',
  },
}));

export default function TokenPage() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Header />

      <div className={classes.input}>
        <Typography className={classes.text}>Token do arquivo:</Typography>
        <TokenInput />
      </div>

    </div>
  );
}
