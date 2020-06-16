import { connect } from 'react-redux';
import { Drawer, List, Avatar, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import React from 'react';

import { setUser, setLightMode } from '../redux/actions/actions';
import avatars from '../avatars'

const styles = theme => ({
    list: {
        width: 250
    },
    userDisplay: {
        padding: theme.spacing(5)
    },
    drawerAvatar: {
        margin: 'auto',
        marginTop: 50,
        width: 100,
        height: 100
    }
})

/**
 * Side navigation bar of the app.
 * When the user is logged in, they can access:
 *  - Home
 *  - Profile
 *  - My Character Sheets
 *  - Log out
 *  - Change between light and dark mode
 * Otherwise, they can only access: 
 *  - Home
 *  - Log in
 *  - Register
 *  - Change between light and dark mode
 * This component should be used as the place where all the links are.
 * 
 * Props:
 * - open = Whether this bar is enabled
 * - handleDrawerClose = Function called when 'closing' action performed, such as clicking outside of the bar
 */
class SideDrawer extends React.Component {

    render() {
        const classes = this.props.classes;
        return (
            <Drawer
                className={classes.drawer}
                anchor="left"
                open={this.props.open}
                onClose={this.props.handleDrawerClose}
            >
                <List className={classes.list}>
                    {this.props.user.currentUser ? (
                        <div>
                            <Avatar className={classes.drawerAvatar} src={avatars.profile[this.props.user.currentUser.avatar]}></Avatar>
                            <div className={classes.userDisplay}>
                                <Typography variant="body1" align="center">Logged in as {this.props.user.currentUser.displayName}</Typography>
                            </div>
                            <Divider />
                            <ListItem button onClick={() => { this.props.history.push("/"); this.props.handleDrawerClose() }}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText>Home</ListItemText>
                            </ListItem>
                            <ListItem button onClick={() => { this.props.history.push("/profile"); this.props.handleDrawerClose() }}>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText>Profile</ListItemText>
                            </ListItem>
                            <ListItem button onClick={() => { this.props.history.push("/character-sheet-gallery"); this.props.handleDrawerClose() }}>
                                <ListItemIcon><AssignmentIndOutlinedIcon /></ListItemIcon>
                                <ListItemText>My Character Sheets</ListItemText>
                            </ListItem>
                            <ListItem button onClick={() => { this.props.handleLogOutClick(); this.props.handleDrawerClose() }}>
                                <ListItemIcon><ExitToAppOutlinedIcon /></ListItemIcon>
                                <ListItemText>Log Out</ListItemText>
                            </ListItem>
                        </div>
                    ) : (
                            <div>
                                <ListItem button onClick={() => { this.props.history.push("/"); this.props.handleDrawerClose() }}>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText>Home</ListItemText>
                                </ListItem>
                                <ListItem button onClick={() => { this.props.history.push("/login"); this.props.handleDrawerClose() }}>
                                    <ListItemIcon><MeetingRoomOutlinedIcon /></ListItemIcon>
                                    <ListItemText>Log In</ListItemText>
                                </ListItem>
                                <ListItem button onClick={() => { this.props.history.push("/register"); this.props.handleDrawerClose() }}>
                                    <ListItemIcon><CreateOutlinedIcon /></ListItemIcon>
                                    <ListItemText>Register</ListItemText>
                                </ListItem>
                            </div>
                        )
                    }
                    <ListItem button onClick={ () => {this.props.lightMode.enabled ? this.props.setLightMode(false) : this.props.setLightMode(true) }}>
                        <ListItemIcon><Brightness7Icon /></ListItemIcon>
                        <ListItemText>Change to {this.props.lightMode.enabled ? "Dark" : "Light"} Mode</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(SideDrawer)));