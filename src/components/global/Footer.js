import React from 'react';
import { Divider, Grid, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
const styles = (theme) => ({
    root: {
        textAlign: 'center',
        padding: theme.spacing(5)
    }
})

class Footer extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <Divider style={{marginBottom: 20}}></Divider>
                <Typography variant="body1" gutterBottom>Contact us if you have any bugs, problems or suggestions!</Typography>
                <Grid container justify="center" alignItems="center">
                    <Grid item>
                        <IconButton onClick={()=>{window.open("https://github.com/Terenco12345/dnd-react-app")}}>
                            <GitHubIcon></GitHubIcon>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={()=>{window.open("https://twitter.com/Cheese_Gr8er")}}>
                            <TwitterIcon></TwitterIcon>
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
    }

    toggleMenu() {

    }
}

export default withRouter(withStyles(styles)(Footer));