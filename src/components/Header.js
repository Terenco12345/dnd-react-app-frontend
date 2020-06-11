import React from 'react';
import { setUser } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from 'react-router';

import { withStyles } from '@material-ui/styles'

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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
    list: {
        width: 250
    },
    userDisplay: {
        padding: theme.spacing(5)
    }
})

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileAnchorElement: null,
            leftDrawerOpen: false
        }
    }

    async componentDidMount() {
        await axios({
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

    handleDrawerOpen = () => {
        this.setState({ leftDrawerOpen: true });
    }

    handleDrawerClose = () => {
        this.setState({ leftDrawerOpen: false })
    }

    handleMenu = (event) => {
        this.setState({ profileAnchorElement: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ profileAnchorElement: null });
    };

    handleLogoutClick = () => {
        this.logOut();
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
                                    <AccountCircle />
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
                                    <MenuItem onClick={() => { this.props.history.push("/profile") }}>Profile</MenuItem>
                                    <MenuItem onClick={this.handleLogoutClick}>Logout</MenuItem>
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
                    <Drawer
                        className={classes.drawer}
                        anchor="left"
                        open={this.state.leftDrawerOpen}
                        onClose={this.handleDrawerClose}
                    >
                        <List className={classes.list}>
                            {this.props.user.currentUser ? (
                                <div>
                                    <div className={classes.userDisplay}>
                                        <Typography variant="body1" align="center">Logged in as {this.props.user.currentUser.displayName}</Typography>
                                    </div>
                                    <Divider />
                                    <ListItem button onClick={() => { this.props.history.push("/"); this.handleDrawerClose() }}>
                                        <ListItemIcon><HomeIcon /></ListItemIcon>
                                        <ListItemText>Home</ListItemText>
                                    </ListItem>
                                    <ListItem button onClick={() => { this.props.history.push("/profile"); this.handleDrawerClose() }}>
                                        <ListItemIcon><AccountCircle /></ListItemIcon>
                                        <ListItemText>Profile</ListItemText>
                                    </ListItem>
                                    <ListItem button onClick={() => { this.props.history.push("/character-sheet-gallery"); this.handleDrawerClose() }}>
                                        <ListItemIcon><AssignmentIndOutlinedIcon /></ListItemIcon>
                                        <ListItemText>My Character Sheets</ListItemText>
                                    </ListItem>
                                    <ListItem button onClick={() => { this.handleLogoutClick(); this.handleDrawerClose() }}>
                                        <ListItemIcon><ExitToAppOutlinedIcon /></ListItemIcon>
                                        <ListItemText>Log Out</ListItemText>
                                    </ListItem>
                                </div>
                            ) : (
                                    <div>
                                        <ListItem button onClick={() => { this.props.history.push("/"); this.handleDrawerClose() }}>
                                            <ListItemIcon><HomeIcon /></ListItemIcon>
                                            <ListItemText>Home</ListItemText>
                                        </ListItem>
                                        <ListItem button onClick={() => { this.props.history.push("/login"); this.handleDrawerClose() }}>
                                            <ListItemIcon><MeetingRoomOutlinedIcon /></ListItemIcon>
                                            <ListItemText>Log In</ListItemText>
                                        </ListItem>
                                        <ListItem button onClick={() => { this.props.history.push("/register"); this.handleDrawerClose() }}>
                                            <ListItemIcon><CreateOutlinedIcon /></ListItemIcon>
                                            <ListItemText>Register</ListItemText>
                                        </ListItem>
                                    </div>
                                )
                            }
                            <ListItem button onClick={this.props.toggleDarkTheme}>
                                <ListItemIcon><Brightness7Icon /></ListItemIcon>
                                <ListItemText>Change to {this.props.themeType === 'light' ? "Dark" : "Light"} Mode</ListItemText>
                            </ListItem>
                        </List>
                    </Drawer>
                </AppBar>
            </div>
        );
    }

    toggleMenu() {
        this.setState((state, props) => {
            return { menuEnabled: !state.menuEnabled }
        })
    }

    async logOut() {
        await axios({
            method: 'post',
            withCredentials: true,
            url: process.env.SERVER_IP + '/logout'
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
}
const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Header)));