import { Avatar } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles'
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { setUser } from '../redux/actions/actions';
import avatars from '../avatars';
import SideDrawer from './SideDrawer'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
})

/**
 * Represents the main navigation bar.
 * Features:
 *  - When not logged in, has log in and register button
 *  - When logged in, can see the user and view user profile
 *  - User can log out from this component
 *  - Can access side drawer, where most navigation will occur
 */
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileAnchorElement: null,
            leftDrawerOpen: false
        }
    }

    componentDidMount() {
        this.getCurrentUser();    
    }

    /**
     * Tries to obtain the current user that is logged in, and will update the redux store of the current user.
     * Obtians user by sending request to server, /current-user.
     */
    getCurrentUser = () => {
        axios({
            method: 'get',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/current-user'
        }).then((res) => {
            this.props.setUser(res.data.user);
        }).catch((err) => {
            if (err) {
                console.log("User not found in header.");
            }
        });
    }

    /**
     * Log out by sending a request to server, /logout.
     */
    logOut() {
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/logout'
        }).then((res) => {
            console.log("Successfully logged out user.");
            this.props.setUser(null);
            this.props.history.push('/');
        }).catch((err) => {
            if (err) {
                this.props.setUser(null);
                this.props.history.push('/');
            }
        });
    }

    /**
     * Sets the profile mini-menu's anchor element. This enables the menu.
     */
    handleMenu = (event) => {
        this.setState({ profileAnchorElement: event.currentTarget });
    };

    /**
     * Sets the profile mini-menu's anchor to be null. This disables the menu.
     */
    handleClose = () => {
        this.setState({ profileAnchorElement: null });
    };

    /**
     * Method to open the side drawer.
     */
    handleDrawerOpen = () => {
        this.setState({ leftDrawerOpen: true });
    }

    /**
     * Method to close the side drawer.
     */
    handleDrawerClose = () => {
        this.setState({ leftDrawerOpen: false })
    }

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={this.handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            DnD App
                        </Typography>
                        {this.props.user.currentUser ? (
                            <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <Avatar src={avatars.profile[this.props.user.currentUser.avatar]}></Avatar>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={this.state.profileAnchorElement}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(this.state.profileAnchorElement)}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={() => { this.props.history.push("/profile") }}><AccountCircle />Profile</MenuItem>
                                    <MenuItem onClick={this.logOut.bind(this)}><ExitToAppOutlinedIcon />Logout</MenuItem>
                                </Menu>
                            </div>)
                            : (
                                <div>
                                    <Button color="inherit" className={classes.login} onClick={() => {
                                        this.props.history.push("/register");
                                        this.handleClose();
                                    }}>Register</Button>
                                    <Button color="inherit" className={classes.login} onClick={() => {
                                        this.props.history.push("/login");
                                        this.handleClose();
                                    }}>Login</Button>
                                </div>
                            )
                        }
                    </Toolbar>

                    <SideDrawer handleDrawerClose={this.handleDrawerClose.bind(this)} open={this.state.leftDrawerOpen} handleLogOutClick={this.logOut.bind(this)}></SideDrawer>
                </AppBar>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Header)));