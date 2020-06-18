import { connect } from 'react-redux';
import { Paper, Typography, IconButton, TextField, Link, InputAdornment, Grid, FormHelperText, Button, CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { registerUser } from '../../redux/actions/userActions';
import { bindActionCreators } from 'redux';

const validEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

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
 * Register page. Contains a form which allows users to register new accounts.
 */
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Field values for each form component
      displayName: "",
      email: "",
      password: "",
      passwordConfirm: "",

      // Errors to display for each form component
      overallError: "",
      displayNameError: "",
      emailError: "",
      passwordError: "",
      passwordConfirmError: "",

      // Show password as plain text or not
      showPassword: false,
      showPasswordConfirm: false
    }
  }

  componentDidMount() {
    this.checkCurrentUser();
  }

  /**
   * Checks if a user is currently logged in. If they are, then they are automatically taken to the profile page.
   * Makes call to /current-user.
   */
  checkCurrentUser = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: process.env.REACT_APP_SERVER_IP + '/current-user'
    }).then((res) => {
      console.log("Successfully authenticated user.");
      this.props.history.push("/profile")
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Change state of this class to match display name input
   * @param event Event for function call
   */
  displayNameChangeHandler = (event) => {
    this.setState({ displayName: event.target.value });
  }

  /**
   * Change state of this class to match email input
   * @param event Event for function call
   */
  emailChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  }

  /**
   * Change state of this class to match password input
   * @param event Event for function call
   */
  passwordChangeHandler = (event) => {
    this.setState({ password: event.target.value });
  }

  /**
   * Change state of this class to match password confirm input
   * @param event Event for function call
   */
  passwordConfirmChangeHandler = (event) => {
    this.setState({ passwordConfirm: event.target.value });
  }

  /**
   * Submit form details to the server. Attempts to register with the current details,
   * if registration fails, display error.
   * @param event Event for function call
   */
  submitHandler = async (event) => {
    event.preventDefault();

    if (this.validateClientSide()) {
      this.setState({
        overallError: "",
        displayNameError: "",
        emailError: "",
        passwordError: "",
        passwordConfirmError: ""
      });

      // Send register request
      this.props.registerUser(this.state.displayName, this.state.email, this.state.password);
    } else {
      console.log("Register UI: Client side validation of form details failed.");
    }
  }

  /**
   * This method is used to validate the registration form on the client side.
   */
  validateClientSide = () => {
    let overallError = "";
    let displayNameError = "";
    let emailError = "";
    let passwordError = "";
    let passwordConfirmError = "";

    let valid = true;

    if (this.state.displayName && this.state.email && this.state.password && this.state.passwordConfirm) {
      // Validate the display name
      if (this.state.displayName.length < 6 || this.state.displayName > 14) {
        displayNameError = "Display name must be between 6 and 14 characters long (inclusive)!";
        valid = false;
      } else {
        displayNameError = "";
      }

      // Validate the email
      if (!validEmailRegex.test(this.state.email)) {
        emailError = "Not a valid email address!";
        valid = false;
      } else {
        emailError = "";
      }

      // Validate the password
      if (!validPasswordRegex.test(this.state.password)) {
        passwordError = "Password must be larger than 8 characters, contain 1 lowercase alphabetical character, contain 1 uppercase alphabetical character and 1 numeric character.";
        valid = false;
      } else {
        passwordError = "";
      }

      // Validate the password confirmation
      if (this.state.passwordConfirm !== this.state.password) {
        passwordConfirmError = "Password confirmation must be the same as your password!";
        valid = false;
      } else {
        passwordConfirmError = "";
      }

    } else {
      overallError = "Cannot leave any fields empty!";
      valid = false;
    }

    // Set error messages
    this.setState({
      overallError: overallError,
      displayNameError: displayNameError,
      emailError: emailError,
      passwordError: passwordError,
      passwordConfirmError: passwordConfirmError
    });

    return valid;
  }

  /**
   * Toggles showing password field as plain text
   */
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  /**
   * Toggles showing password confirm field as plain text
   */
  handleClickShowPasswordConfirm = () => {
    this.setState({ showPasswordConfirm: !this.state.showPasswordConfirm });
  };

  render() {
    const classes = this.props.classes;
    if (this.props.user.currentUser) {
      this.props.history.push("/");
    }

    var serverError = "";
    if (this.props.user.registerError) {
      if (this.props.user.registerError.message.includes("400")) {
        serverError = "User already exists with this email!";
      }
    }

    return (
      <Paper className={classes.root}>
        <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
          Register new account
        </Typography>
        <form noValidate>
          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <FormHelperText error textalign="center">{serverError ==="" ? this.state.overallError : serverError}</FormHelperText>
            <TextField id="displayName" label="Display Name" variant="outlined" className={classes.textField} onChange={this.displayNameChangeHandler}
              error={this.state.displayNameError !== ""} helperText={this.state.displayNameError} />
            <TextField id="email" label="Email" variant="outlined" className={classes.textField} onChange={this.emailChangeHandler}
              error={this.state.emailError !== ""} helperText={this.state.emailError} />
            <TextField id="password" label="Password" variant="outlined" className={classes.textField}
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
              error={this.state.passwordError !== ""} helperText={this.state.passwordError} />
            <TextField id="passwordConfirm" label="Confirm Password" variant="outlined" className={classes.textField}
              type={this.state.showPasswordConfirm ? 'text' : 'password'}
              onChange={this.passwordConfirmChangeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={this.handleClickShowPasswordConfirm}>
                      {this.state.showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={this.state.passwordConfirmError !== ""} helperText={this.state.passwordConfirmError} />
            <Button variant="contained" color="primary" component="span" size="large" className={classes.textField} onClick={this.submitHandler}>
              {this.props.user.registerPending ? <CircularProgress color="white" size={25}></CircularProgress> : "Register"}
            </Button>
            <Link href="/login" color="secondary">Already have an account? Click here.</Link>
          </Grid>
        </form>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  registerUser: registerUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(RegisterPage)));