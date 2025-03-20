import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    top: 'auto',
    bottom: 0,
    width: '100%',
    position: 'fixed',
    backgroundColor: '#343434',
    color: theme.palette.common.white,
    textAlign: 'center',
  },
}));

function Footer() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.footer}>
      <Toolbar>
        <Typography sx={{ fontSize: { xs: 16, md: 20 } }}>
          Design & Built by SSB © 2025
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;