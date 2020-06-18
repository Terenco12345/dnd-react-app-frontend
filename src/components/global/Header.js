import { Avatar } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles'
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import avatars from '../../avatars';
import SideDrawer from './SideDrawer'
import { fetchCurrentUser, logoutCurrentUser } from './../../redux/actions/userActions';
import { bindActionCreators } from 'redux';

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
            leftDrawerOpen: false
        }
    }

    componentDidMount() {
        this.props.fetchCurrentUser();
    }

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
                                    onClick={() => { this.props.history.push("/profile") }}
                                    color="inherit"
                                >
                                    <Avatar src={avatars.profile[this.props.user.currentUser.avatar]}></Avatar>
                                </IconButton>
                            </div>)
                            : (
                                <div>
                                    <Button color="inherit" className={classes.login} onClick={() => {
                                        this.props.history.push("/register");
                                    }}>Register</Button>
                                    <Button color="inherit" className={classes.login} onClick={() => {
                                        this.props.history.push("/login");
                                    }}>Login</Button>
                                </div>
                            )
                        }
                    </Toolbar>

                    <SideDrawer handleDrawerClose={this.handleDrawerClose.bind(this)} open={this.state.leftDrawerOpen}></SideDrawer>
                </AppBar>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCurrentUser: fetchCurrentUser,
    logoutCurrentUser: logoutCurrentUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Header)));