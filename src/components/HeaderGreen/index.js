import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { default as logoWhite } from 'assets/img/logo-white.svg';
import { makeStyles, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  headerBase: {
    background: '#3AAC9E',
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
    color: '#fff',
    marginRight: '32px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
}));

const HeaderGreen = () => {
  const classes = useStyles();

  function onSubmit() {
    localStorage.clear();
  }

  return (
    <header className={classes.headerBase}>
      <img src={logoWhite} className={classes.logoImg} alt="" />
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

export default HeaderGreen;
