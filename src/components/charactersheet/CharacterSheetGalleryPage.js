import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Typography, Grid, IconButton, TextField, Card, CardMedia, CardActionArea, CardContent, CardActions, Divider, InputAdornment } from '@material-ui/core';


import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/styles';
import avatars from '../../avatars';

const styles = theme => ({
    root: {
      paddingTop: '8%',
      paddingBottom: '4%',
      minHeight: 800,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      textAlign: 'center',
    },
    createButton: {
        margin: theme.spacing(1),
        position: "fixed",
        bottom: theme.spacing(5),
        right: theme.spacing(6),
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            background: theme.palette.secondary.main,
        }
    },
    // Sort container (search bar, sorting etc.)
    sortContainer: {
        display: 'flex',
        justify: 'center',
        padding: theme.spacing(2)
    },
    searchField: {
        width: 500,
        maxWidth: '80%'
    },
    // Sheet list view
    characterSheetContainer: {
        paddingTop: theme.spacing(3),
        transform: 'translateZ(0)',
        borderRadius: theme.spacing(1),
    },
    characterSheetList: {
        marginTop: theme.spacing(4),
        textAlign: 'center',
        height: 'auto'
    },
    characterSheetCard: {
        width: 400,
        margin: 'auto',
    },
    cardActionArea: {
        height: 200,
    },
    cardMedia: {
        height: 200,
    },
    cardContent: {
        textAlign: 'center'
    },
    cardAction: {
        textAlign: 'center'
    }
})

class CharacterSheetGalleryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            characterSheets:[]
        }
    }

    componentDidMount(){
        this.retrieveCharacterSheets();
    }

    async retrieveCharacterSheets() {
        console.log("Sending test request for resource...");
        await axios({
            method: 'get',
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/all',
            withCredentials: true
        }).then((res) => {
            console.log(res);
            this.setState({characterSheets : res.data})
        }).catch((err) => {
            if (err) {
                console.log("User is not authorized to access this resource.");
            }
        })
    }

    async createNewCharacterSheet() {
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/new',
            headers: {'content-type': 'application/json'},
        }).then((res) => {
            console.log(res);
            this.retrieveCharacterSheets();
        }).catch((err) => {
            console.log(err);
        });
    }

    async deleteCharacterSheet(sheetId) {
        axios({
            method: 'delete',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/'+sheetId,
        }).then((res) => {
            console.log(res);
            this.retrieveCharacterSheets();
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const classes = this.props.classes;
        // Sort this.state.characterSheets here

        return (
            <div className = {classes.root}>
                <Typography variant='h2'>Character sheet view</Typography>
                <div className = {classes.sortContainer}>
                    <Grid className={classes.characterSheetList} 
                        container 
                        spacing={3}
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <TextField id="password" label="Search" variant="standard" className={classes.searchField} 
                                type='text' 
                                onChange={this.passwordChangeHandler} 
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton>
                                            <SearchIcon></SearchIcon>
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }} 
                            />
                        </Grid>
                    </Grid>
                </div>
                <Divider></Divider>
                {this.state.characterSheets.length === 0 ? 
                    (<Typography>Uh oh! It looks like you don't have any sheets!</Typography>) : 
                    <Grid className={classes.characterSheetList} 
                        container 
                        spacing={3}
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        {this.state.characterSheets.map((sheet, index)=>(
                            <Grid item key={index}>
                                <Card elevation={3} className={classes.characterSheetCard}>
                                    <CardActionArea className={classes.cardActionArea}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={avatars.characterSheet[sheet.avatar]}
                                        />
                                    </CardActionArea>
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5">{sheet.characterName}</Typography>
                                        <Typography variant="body1">Experience: {sheet.experience}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.cardAction}>
                                        <Button>View</Button>
                                        <Button>Edit</Button>
                                        <Button onClick={()=>{this.deleteCharacterSheet(sheet._id)}}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                }
                <IconButton className={classes.createButton} onClick={this.createNewCharacterSheet.bind(this)} variant="outlined">
                    <AddIcon fontSize="large"></AddIcon>
                </IconButton>
            </div>
        );
    }
}


export default withRouter(withStyles(styles)(CharacterSheetGalleryPage));