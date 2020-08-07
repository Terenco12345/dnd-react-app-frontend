import React from 'react';

import { bindActionCreators } from 'redux';
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
import GroupIcon from '@material-ui/icons/Group';
import CasinoIcon from '@material-ui/icons/Casino';

import { fetchCurrentUser, logoutCurrentUser } from './../../redux/actions/userActions';
import { setLightMode } from '../../redux/actions/lightModeActions';
import avatars from '../../avatars'

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
                            <br />
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
                            <ListItem button onClick={() => { this.props.history.push("/campaigns"); this.props.handleDrawerClose() }}>
                                <ListItemIcon><GroupIcon /></ListItemIcon>
                                <ListItemText>Campaigns</ListItemText>
                            </ListItem>
                            <ListItem button onClick={() => { this.props.logoutCurrentUser(); this.props.handleDrawerClose() }}>
                                <ListItemIcon><ExitToAppOutlinedIcon /></ListItemIcon>
                                <ListItemText>Log Out</ListItemText>
                            </ListItem>
                        </div>
                    ) : (
                            <div>
                                <br />
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
                    <br />
                    <Divider></Divider>
                    <br />
                    <div>
                        <ListItem button onClick={() => { this.props.history.push("/dice-roller"); this.props.handleDrawerClose() }}>
                            <ListItemIcon><CasinoIcon /></ListItemIcon>
                            <ListItemText>Dice Roller</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => { this.props.lightMode.enabled ? this.props.setLightMode(false) : this.props.setLightMode(true) }}>
                            <ListItemIcon><Brightness7Icon /></ListItemIcon>
                            <ListItemText>Change to {!this.props.lightMode.enabled ? "Dark" : "Light"} Mode</ListItemText>
                        </ListItem>
                    </div>
                </List>
            </Drawer>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    lightMode: state.lightMode
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCurrentUser: fetchCurrentUser,
    logoutCurrentUser: logoutCurrentUser,
    setLightMode: setLightMode
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(SideDrawer)));