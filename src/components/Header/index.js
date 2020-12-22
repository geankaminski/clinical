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
  },
  logoImg: {
    width: '215px',
    height: '105px',
    marginLeft: '31px',
    color: '#fff',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <header className={classes.headerBase}>
      <Link
       to="/login">
        <img src={logoWhite} className={classes.logoImg} alt="" />
      </Link>
    </header>
  );
};

export default Header;
