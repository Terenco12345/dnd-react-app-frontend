import React from 'react';
import axios from 'axios'
import { withStyles } from '@material-ui/styles';
import { setUser } from '../../redux/actions/userActions';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { Paper, Menu, Grid, Divider } from '@material-ui/core';

import avatars from '../../avatars';

const styles = theme => ({
    root: {
        
    },
    topContainer: {
        padding: '5%',
        textAlign: 'center',
        background: theme.palette.primary.light
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

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorElement: null,
            selection: 0
        }
    }

    updateAvatar = () => {
        let index = this.state.selection;
        console.log("Updating avatar selection to "+index);
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/current-user/avatar',
            headers: {'content-type': 'application/json'},
            data: {avatarSelection: index}
        }).then((res) => {
            console.log(res);
            this.props.setUser(res.data.user);
        }).catch((err) => {
            console.log(err);
        });
    };

    toggleImagePicker = (event) => {
        if(this.state.anchorElement){
            this.setState({anchorElement: null})
        } else {
            this.setState({anchorElement: event.currentTarget})
        }
    }

    handleAvatarSelection = (index) => {
        console.log(index)
        this.setState({selection: index});
    }

    render() {
        const classes = this.props.classes;
        const user = this.props.user.currentUser;

        if (this.props.user.currentUser) {
            return (
                <div className={classes.root}>
                    <Paper className={classes.topContainer} square>
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
                                <Grid className = {classes.grid} container spacing={2} alignItems="center" justify="center">
                                    {avatars.profile.map((avatarPath, index)=>(
                                        <Grid item key={index}>
                                            <IconButton onClick={()=>{this.handleAvatarSelection(index)}}>
                                                <Avatar src={avatarPath}></Avatar>
                                            </IconButton>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Divider></Divider>
                                <Avatar src={avatars.profile[this.state.selection]} style={{margin: 'auto', marginTop: 50, marginBottom: 50, width: 100, height: 100}}></Avatar>
                                <Button variant="outlined" style={{marginLeft: 8, marginRight: 8}} onClick={this.updateAvatar}>
                                    Update avatar
                                </Button>
                            </div>
                        </Menu>

                        <Typography variant="h2">
                            {user.displayName}
                        </Typography>
                        <Typography variant="h4">
                            {user.email}
                        </Typography>
                        <Button className={classes.textEditButton} variant="outlined">Edit Information</Button>
                    </Paper>
                </div>
            );
        } else {
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

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(ProfilePage)));
