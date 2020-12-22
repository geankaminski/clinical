import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
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
  button: {
    border: 0,
    cursor: 'pointer',
    background: 'none',
    padding: 0,
    font: 'inherit',
    outline: 'inherit',
    width: '70%',
  },
  bar: {
    
    border: '1px solid #C1C1C1',
  },
}));

const PrescriptionLink = ({
  history,
  name,
  date,
  id,
  avatar,
  nome,
  sobrenome,
  foto,
}) => {
  const classes = useStyles();

  const handleClick = () => {
    history.push({
      pathname: '/visualizar-receita',
      state: { avatar: avatar, id: id, nome: nome, sobrenome: sobrenome, foto: foto }
    })
  }

  const formatName = (name) => {
    if (name.length > 16) {
      const subName = name.substr(0, 16);
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
          <Typography className={classes.text}>{formatName(name)}</Typography>
        </div>
        <div className={classes.right}>
          <Typography className={classes.date}>{date}</Typography>
        </div>
      </div>
      <hr className={classes.bar} />
    </button>
  );
};

PrescriptionLink.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string,
  date: PropTypes.string,
  avatar: PropTypes.string,
  id: PropTypes.string,
  nome: PropTypes.string,
  foto: PropTypes.string,
  sobrenome: PropTypes.string,
};

export default compose(
  withRouter,
)(PrescriptionLink);
