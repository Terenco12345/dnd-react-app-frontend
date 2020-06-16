import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import Button from "@material-ui/core/Button";
import React from 'react';
import Typography from "@material-ui/core/Typography";

import { setUser } from '../../redux/actions/actions';

const styles = theme => ({
  root: {
    paddingTop: '10%',
    minHeight: 1000,
    textAlign: 'center',
  },
  button: {
    marginTop: '50px',
    margin: 'auto',
    width: 400,
    height: 50,
    maxWidth: '80%',
    fontSize: '100%'
  }
})

class LandingPage extends React.Component {
  render() {
    const classes = this.props.classes;
    if(this.props.user.currentUser){
      return (
        <div className={classes.root}>
          <Typography variant="h2" align="center">Hello, {this.props.user.currentUser.displayName}.</Typography>
          <Button className={classes.button} variant="outlined" onClick={()=>{this.props.history.push("/character-sheet-gallery")}}>View your character sheets</Button>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Typography variant="h2" align="center">Welcome to Terence's DnD App!</Typography>
          <Button className={classes.button} variant="outlined" onClick={()=>{this.props.history.push("/register")}}>Click here to register</Button>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(LandingPage)));
