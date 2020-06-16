import { connect } from 'react-redux';
import { Paper, Typography, IconButton } from '@material-ui/core';
import { withRouter, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { setUser } from '../../redux/actions/actions';

const styles = theme => ({
  root: {
    padding: '5%',
    margin: 'auto',
    marginTop: '4%',
    width: 800,
    maxWidth: '90%'
  },
  textField: {
    margin: '2%',
    width: 400,
    maxWidth: '90%'
  },
})

/**
 * This page enables users to log into their accounts.
 */
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      overallError: "",

      showPassword: false,
    }
  }

  /**
   * Update state to match email input
   * @param event 
   */
  emailChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  }

  /**
   * Update state to match password input
   * @param event 
   */
  passwordChangeHandler = (event) => {
    this.setState({ password: event.target.value });
  }

  /**
   * Toggles whether the password field should be visible as plain text.
   */
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  /**
   * Submits a login request to the server.
   * Makes POST request to /login.
   * @param event 
   */
  submitHandler = async (event) => {
    event.preventDefault();

    // Check if the form is valid and can be sent
    // Most validation should theoretically be done on server side.
    if (this.validateClientSide()) {
      this.setState({
        emailError: "",
        passwordError: "",
      });

      // Should send a login request to the server.
      await axios({
        method: 'post',
        withCredentials: true,
        url: process.env.REACT_APP_SERVER_IP + '/login',
        data: {
          email: this.state.email,
          password: this.state.password,
        }
      }).then((res) => {
        // Redirect to current-user
        this.props.setUser(res.data.user);
        this.props.history.push('/');
      }).catch((err) => {
        if (err) {
          if (err.response !== undefined) {
            this.setState({ overallError: err.response.data });
          }
        }
      });
    } else {
      console.log("Login UI: Client side validation of form details failed.");
    }
  }

  /**
   * This method is used to validate the login form on the client side.
   */
  validateClientSide = () => {
    let emailError = "";
    let passwordError = "";
    let overallError = "";
    let valid = true;

    if (!(this.state.email && this.state.password)) {
      overallError = "Cannot leave any fields empty!";
      valid = false;
    } else {
      overallError = "";
    }

    this.setState({
      emailError: emailError,
      passwordError: passwordError,
      overallError: overallError
    });

    return valid;
  }

  render() {
    const classes = this.props.classes;

    if (this.props.user.currentUser) {
      return (<Redirect to="/"></Redirect>);
    }

    return (
      <Paper className={classes.root}>
        <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
          Login
      </Typography>
        <form noValidate autoComplete="off">

          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <FormHelperText error textalign="center">{this.state.overallError}</FormHelperText>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              className={classes.textField}
              onChange={this.emailChangeHandler}
              error={this.state.emailError !== ""} helperText={this.state.emailError} />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              className={classes.textField}
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.passwordChangeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={this.handleClickShowPassword}>
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={this.state.passwordError !== ""}
              helperText={this.state.passwordError}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              component="span"
              size="large"
              className={classes.textField}
              onClick={this.submitHandler}>
              Login
            </Button>
            <Link href="/register" color="secondary">Don't have an account? Register here!</Link>
          </Grid>
        </form>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(LoginPage)));