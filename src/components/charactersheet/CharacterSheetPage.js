import React from 'react';
import axios from 'axios';
import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router';
import ReactJson from 'react-json-view'

const styles = (theme) => ({
    container: {
        textAlign: 'center',
        marginTop: 20,
    },
    paper: {
        textAlign: 'left',
        width: 1200,
        maxWidth: '80%',
        margin: 'auto',
        padding: 50
    }
})

class CharacterSheetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheet: null
        }
    }

    componentDidMount() {
        this.getSheetById(this.props.match.params.id);
    }

    getSheetById(id) {
        axios({
            method: 'get',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/' + id,
        }).then((res) => {
            console.log(res);
            this.setState({ sheet: res.data });
        }).catch((err) => {
            console.log(err);
            // Perhaps an authentication error has occured
        });
    }

    render() {
        const classes = this.props.classes;
        if (this.state.sheet === null) {
            return (
                <div className={classes.container}>
                    <Typography variant="h4">Sheet is loading...</Typography>
                </div>
            )
        } else {
            return (
                <div className={classes.container}>
                    <Typography variant="h3" gutterBottom>Character Sheet for {this.state.sheet.characterName}</Typography>
                    <Paper className={classes.paper}>
                        <ReactJson src={this.state.sheet} />
                    </Paper>
                </div>
            );
        }
    }
}

export default withRouter(withStyles(styles)(CharacterSheetPage));