import { connect } from 'react-redux';
import { Paper, Menu, Grid, Divider, Badge, Button, CircularProgress } from '@material-ui/core';
import { withRouter, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import React from 'react';
import Typography from "@material-ui/core/Typography";

import avatars from '../../avatars';
import { fetchCurrentUser, updateCurrentUser } from './../../redux/actions/userActions';
import { bindActionCreators } from 'redux';

const styles = theme => ({
    root: {
        minHeight: 700,
        paddingTop: theme.spacing(10),
        textAlign: 'center',
    },
    button: {
        marginTop: '50px',
        margin: 'auto',
        width: 400,
        height: 50,
        maxWidth: '80%',
        fontSize: '100%'
    },
    avatar: {
        width: 300,
        height: 300,
        margin: 'auto',
        background: theme.palette.background.paper,
    },
    avatarEditButton: {
        background: theme.palette.background.paper,
        '&:hover': {
            background: theme.palette.background.paper,
        }
    },
    avatarPicker: {
        textAlign: 'center',
        margin: theme.spacing(2)
    },
    grid: {
        margin: theme.spacing(2),
        width: 250
    },
    textEditButton: {
        marginTop: theme.spacing(2)
    },
})

/**
 * This page enables users to change and edit their own profiles.
 */
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorElement: null,
            selection: 0
        }
    }

    /**
     * Make a request to update the avatar for this user profile.
     * Makes POST request to /current-user/avatar
     */
    updateAvatar = () => {
        let index = this.state.selection;
        console.log("Updating avatar selection to " + index);
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/current-user/avatar',
            headers: { 'content-type': 'application/json' },
            data: { avatarSelection: index }
        }).then((res) => {
            console.log(res);
            this.props.setUser(res.data.user);
        }).catch((err) => {
            console.log(err);
        });
    };

    /**
     * Toggles whether the image picker menu is shown
     * @param event 
     */
    toggleImagePicker = (event) => {
        if (this.state.anchorElement) {
            this.setState({ anchorElement: null })
        } else {
            this.setState({ anchorElement: event.currentTarget })
        }
    }

    /**
     * Updates the state to match avatar selection
     * @param index index of selection 
     */
    handleAvatarSelection = (index) => {
        console.log(index)
        this.setState({ selection: index });
    }

    render() {
        const classes = this.props.classes;
        const user = this.props.user.currentUser;

        if (this.props.user.currentUser) {
            return (
                <div className={classes.root}>
                    <Badge
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        overlap="circle"
                        badgeContent={(
                            <IconButton className={classes.avatarEditButton} onClick={this.toggleImagePicker}>
                                <PhotoCameraIcon />
                            </IconButton>
                        )}
                    >
                        <Avatar className={classes.avatar} src={avatars.profile[this.props.user.currentUser.avatar]}></Avatar>
                    </Badge>

                    <Menu
                        anchorEl={this.state.anchorElement}
                        open={Boolean(this.state.anchorElement)}
                        onClose={this.toggleImagePicker}
                    >
                        <div className={classes.avatarPicker}>
                            <Typography variant="h6" align="center">
                                Pick an avatar
                                </Typography>
                            <Divider></Divider>
                            <Grid className={classes.grid} container spacing={2} alignItems="center" justify="center">
                                {avatars.profile.map((avatarPath, index) => (
                                    <Grid item key={index}>
                                        <IconButton onClick={() => { this.handleAvatarSelection(index) }}>
                                            <Avatar src={avatarPath}></Avatar>
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>
                            <Divider></Divider>
                            <Avatar src={avatars.profile[this.state.selection]} style={{ margin: 'auto', marginTop: 50, marginBottom: 50, width: 100, height: 100 }}></Avatar>
                            <Button variant="outlined" style={{ marginLeft: 8, marginRight: 8 }} onClick={() => {
                                this.props.updateCurrentUser({ avatar: this.state.selection });
                            }}>
                                {this.props.user.updatePending ? <CircularProgress color="inherit" size={25}></CircularProgress> : "Update avatar"}
                            </Button>
                        </div>
                    </Menu>
                    <Typography variant="h2">
                        {user.displayName}
                    </Typography>
                    <Typography variant="h4">
                        {user.email}
                    </Typography>
                </div>
            );
        } else {
            // No current user found. Redirect to home.
            return (
                <div className={classes.root}>
                    <Redirect to="/"></Redirect>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCurrentUser: fetchCurrentUser,
    updateCurrentUser: updateCurrentUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(ProfilePage)));
