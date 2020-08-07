import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { purple, deepPurple, indigo, lightBlue } from '@material-ui/core/colors';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLightMode } from './redux/actions/lightModeActions';
import { fetchCurrentUser } from './redux/actions/userActions';

import CharacterSheetPage from './components/charactersheet/CharacterSheetPage';
import CharacterSheetGalleryPage from "./components/charactersheet/CharacterSheetGalleryPage";
import LandingPage from "./components/landing/LandingPage";
import RegisterPage from './components/user/RegisterPage';
import LoginPage from './components/user/LoginPage';
import ProfilePage from "./components/user/ProfilePage";
import DiceRollerPage from "./components/diceroller/DiceRollerPage";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";

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
            <Route path="/dice-roller">
              <DiceRollerPage/>
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

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCurrentUser: fetchCurrentUser,
  setLightMode: setLightMode
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App);