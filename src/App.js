import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';

import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

import LandingPage from "./components/landing/LandingPage";
import RegisterPage from './components/user/RegisterPage';
import LoginPage from './components/user/LoginPage';
import ProfilePage from "./components/user/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CharacterSheetGalleryPage from "./components/charactersheet/CharacterSheetGalleryPage";
import { purple, deepPurple, indigo, lightBlue } from '@material-ui/core/colors';
import { setUser, setLightMode } from './redux/actions/actions';
import { connect } from 'react-redux';
import CharacterSheetPage from './components/charactersheet/CharacterSheetPage';

// Light theme, for people in light mode
const lightTheme = {
  palette: {
    type: "dark",
    primary: indigo,
    secondary: lightBlue
  }
}

// Dark theme, for people in dark mode
const darkTheme = {
  palette: {
    type: "light",
    primary: purple,
    secondary: deepPurple
  }
}

/**
 * Main application component. Handles react-router-dom routing, and contains the main theme.
 */
class App extends React.Component {
  render() {
    let theme = null;
    this.props.lightMode.enabled ? theme = lightTheme : theme = darkTheme
    const muiTheme = responsiveFontSizes(createMuiTheme(theme));

    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Header/>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route exact path="/profile">
              <ProfilePage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/character-sheet-gallery">
              <CharacterSheetGalleryPage />
            </Route>
            <Route path="/character-sheet/:id">
              <CharacterSheetPage/>
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  lightMode: state.lightMode
})

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  setLightMode: enabled => dispatch(setLightMode(enabled))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
