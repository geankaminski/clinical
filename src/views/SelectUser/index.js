import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { curry, get as lodashGet } from 'lodash';
import { Link } from 'react-router-dom';
import { setDisplayName, compose } from 'recompose';
import { immutableToJS } from 'helpers';
import { connect } from 'react-redux';
import withAppContext from 'components/AppContext';
import axios from 'axios';

import { isMobile } from 'helpers/utils';
import { HeaderWhite } from 'components';
import { default as avatarImg } from 'assets/img/avatar-img.svg';

import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    fontFamily: 'Montserrat',
    fontSize: '36px',
    textAlign: 'center',
    marginTop: isMobile ? '50px' : '100px',
  },
  container: {
    background: '#EFFAF8',
    height: '100%',
  },
  box: {
    border: '1px solid #3AAC9E',
    boxSizing: 'border-box',
    margin: '0 auto',
    width: 'fit-content',
    marginTop: isMobile ? '30px' : '53px',
    display: 'flex',
    flexWrap: isMobile && 'wrap',
  },
  item: {
    textAlign: 'center',
    margin: '45px 30px 45px 30px',
    flexGrow: 1,
  },
  avatarImage: {
    width: '122.59px',
    height: '107.42px',
    background: '#fff',
    borderRadius: '50%',
  },
  addButton: {
    width: '122.59px',
    height: '107.42px',
    background: '#E5E5E5',
    borderRadius: '50%',
    border: '2px solid #3AAC9E',
    cursor: 'pointer',
    color: '#3AAC9E',
    marginTop: '6px',
  },
  name: {
    fontFamily: 'Montserrat',
    fontSize: '18px',
    textAlign: 'center',
  },
  selectButton: {
    width: '100%',
    textTransform: 'none',
    "&:hover": {
      backgroundColor: "#EBF8F7"
    }
  },
}));

const SelectUser = () => {
  const classes = useStyles();

  const [avatars, setAvatars] = useState([]);
  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');

  useEffect(() => {
    getAvatar();
  }, []);

  let getAvatar = async () => {
    let res = await axios.get("https://clinicalbook.polijrinternal.com/web/avatar/", {
      headers: {
        'Authorization': `Token ${accessToken}`
      }
    });
    setAvatars(res.data);
    console.log(res.data);
  }

  return (
    <>
      <HeaderWhite />
      <div>
        <Typography className={classes.title}>Escolha uma das pessoas da família...</Typography>

        <Grid xs={12} className={classes.box}>

          {avatars.map(avatar => {
            return (
              <Grid xs={12} className={classes.item} key={avatar.id}>
                <Button
                  to={{
                    pathname: `/dashboard/${avatar.id}`,
                    state: {
                      id: `${avatar.id}`,
                      nome: `${avatar.nome}`,
                      sobrenome: `${avatar.sobrenome}`,
                      foto: `${avatar.foto}`,
                    }
                  }}
                  component={Link}
                  // to="/dashboard"
                  className={classes.selectButton}
                  
                >
                  <div
                    
                  >
                    {/* <img src={avatar.foto} alt="" className={classes.avatarImage} /> */}
                    <img src={avatar.foto} alt="" className={classes.avatarImage} />
                    <Typography className={classes.name}>
                      {avatar.nome} {avatar.sobrenome}
                    </Typography>
                  </div>
                </Button>
              </Grid>
            )
          })}

          <Grid  xs={12} className={classes.item}>
            <Button
              to="/cadastro"
              component={Link}
              className={classes.addButton}
            >
              <AddIcon
                style={{ fontSize: 40 }}
              />
            </Button>

          </Grid>

        </Grid>

      </div>

    </>

  );
}


SelectUser.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

SelectUser.defaultProps = {
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
});


export default compose(
  setDisplayName('SelectUser'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withAppContext,
  immutableToJS,
)(SelectUser);
