import { connect } from 'react-redux';
import { Paper, Typography, IconButton, CircularProgress } from '@material-ui/core';
import { withRouter, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { loginUser } from './../../redux/actions/userActions';
import { bindActionCreators } from 'redux';

const styles = theme => ({
  root: {
    minHeight: 700,
  },
  login: {
    padding: theme.spacing(10),
    margin: 'auto',
    marginTop: theme.spacing(10),
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

      this.props.loginUser(this.state.email, this.state.password);
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

    var serverError = "";
    if (this.props.user.loginError) {
      if (this.props.user.loginError.message.includes("401")) {
        serverError = "Incorrect email/password!";
      }
    }

    if (this.props.user.currentUser) {
      return (<Redirect to="/"></Redirect>);
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.login}>
          <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
            Login
        </Typography>
          <form noValidate autoComplete="off">
            <Grid container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <FormHelperText error textalign="center">{serverError === "" ? this.state.overallError : serverError}</FormHelperText>
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
                {this.props.user.loginPending ? <CircularProgress color="inherit" size={25}></CircularProgress> : "Login"}
              </Button>
              <Link href="/register" color="secondary">Don't have an account? Register here!</Link>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  loginUser: loginUser,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(LoginPage)));