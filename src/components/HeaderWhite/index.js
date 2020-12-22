import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { default as logoGreen } from 'assets/img/logo-green.svg';

import {
  withStyles,
} from '@material-ui/core/styles';

import { makeStyles, Typography, Button } from '@material-ui/core';

const styles = theme => ({
  headerBase: {
    background: '#fff',
    width: '100%',
    height: '108px',
    border: '1px solid #C1C1C1',
  },
  logoImg: {
    width: '215px',
    height: '105px',
    marginLeft: '31px',
    filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
  },
});

const useStyles = makeStyles(() => ({
  headerBase: {
    background: '#fff',
    width: '100%',
    height: '108px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoImg: {
    width: '215px',
    height: '105px',
    marginLeft: '31px',
    color: '#fff',
  },
  logout: {
    fontFamily: 'Caudex',
    fontSize: '36px',
    alignItems: 'right',
    textAlign: 'right',
    color: '#3AAC9E',
    marginRight: '32px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
}));

const HeaderWhite = () => {
  const classes = useStyles();

  function onSubmit() {
    localStorage.clear();
  }

  return (
    <header className={classes.headerBase}>
      <img src={logoGreen} className={classes.logoImg} alt="" />
      <Typography 
        className={classes.logout}
        to="/login"
        component={Link}
        onClick={onSubmit}
      >
        Sair
      </Typography>
    </header>
  );
};


export default HeaderWhite;
