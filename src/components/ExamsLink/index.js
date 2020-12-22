import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  link: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Montserrat',
    fontSize: '32px',
    textAlign: 'left',
    height: '60px',
  },
  subText: {
    fontFamily: 'Montserrat',
    fontSize: '19px',
    marginLeft: '5px',
  },
  date: {
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'right',
    color: '#757575',
  },
  left: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    border: '1px solid #C1C1C1',
  },
  button: {
    border: 0,
    cursor: 'pointer',
    background: 'none',
    padding: 0,
    font: 'inherit',
    outline: 'inherit',
    width: '70%',
  },
}));

const ExamsLink = ({
  history,
  name,
  date,
  lab,
  id,
  avatar,
  nome,
  sobrenome,
  foto,
}) => {
  const classes = useStyles();

  const handleClick = () => {
    history.push({
      pathname: '/visualizar-exame',
      state: { avatar: avatar, id: id, nome: nome, sobrenome: sobrenome, foto: foto }
    })
  }
  
  const formatName = (name) => {
    if (name.length > 12) {
      const subName = name.substr(0, 12);
      return subName.concat("...");
    }
    return name;
  }

  return (
    <button
      onClick={handleClick}
      className={classes.button}
    >
      <div className={classes.link}>
        <div className={classes.left}>
          <Typography className={classes.text}>{formatName(name)} - <span className={classes.subText}>{formatName(lab)}</span></Typography>
        </div>
        <div className={classes.right}>
          <Typography className={classes.date}>{date}</Typography>
        </div>
      </div>
      <hr className={classes.bar} />
    </button>
  );
};

ExamsLink.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string,
  date: PropTypes.string,
  lab: PropTypes.string,
  avatar: PropTypes.string,
  id: PropTypes.string,
  nome: PropTypes.string,
  foto: PropTypes.string,
  sobrenome: PropTypes.string,
};

export default compose(
  withRouter,
)(ExamsLink);

