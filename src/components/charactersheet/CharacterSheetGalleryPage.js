import { bindActionCreators } from 'redux';
import { Button, Typography, Grid, IconButton, TextField, Card, CardMedia, CardActionArea, CardContent, CardActions, Divider, InputAdornment, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

import { fetchCurrentUser } from './../../redux/actions/userActions';
import { retrieveCharacterSheetsForCurrentUser, updateCharacterSheetForCurrentUser, deleteCharacterSheetForCurrentUser } from '../../redux/actions/characterSheetActions';
import avatars from '../../avatars';
import CharacterSheetForm from './CharacterSheetForm';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        minHeight: 700,
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

const emptySheet = {
    _id: null,
    characterName: "",
    race: "",
    class: "",
    background: "",
    alignment: "",
    health: {
        currentHealth: 0,
        maxHealth: 0
    },
    armourClass: 0,
    experience: 0,
    hitDice: {
        hitDiceType: 4,
        currentHitDice: 1,
        maxhitDice: 1,
    },
    description: "",
    equipment: "",
    proficiencies: "",

    // All stats
    stats: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    },

    // All skills
    skills: {
        acrobatics: false,
        animalHandling: false,
        arcana: false,
        athletics: false,
        deception: false,
        history: false,
        insight: false,
        intimidation: false,
        investigation: false,
        medicine: false,
        nature: false,
        perception: false,
        performance: false,
        persuasion: false,
        religion: false,
        sleightOfHand: false,
        stealth: false,
        survival: false,
    },

    // Feats, spells and racial traits
    featsAndSpells: [],
}

/**
 * This page allows users to create and view their character sheet collection.
 * They can create, view, edit or delete character sheets on this page.
 * There is also a search bar to search for a specific character.
 */
class CharacterSheetGalleryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            characterSheets: [],
            characterSheetCreatorEnabled: false,
            characterSheetEditorEnabled: false,
            formSheet: emptySheet,
            search: "",
        }
    }

    componentDidMount() {
        if (this.props.user.currentUser === null) {
            this.props.history.push('/');
        } else {
            this.props.retrieveCharacterSheetsForCurrentUser();
        }
    }

    /**
     * Enables the character sheet creator
     */
    enableCharacterSheetCreator() {
        this.setState((initialState) => ({
            characterSheetCreatorEnabled: true,
            characterSheetEditorEnabled: false,
            formSheet: emptySheet,
            formSheetId: null
        }))
    }

    /**
     * Enables the character sheet editor
     */
    enableCharacterSheetEditor(sheet) {
        this.setState((initialState) => ({
            characterSheetCreatorEnabled: false,
            characterSheetEditorEnabled: true,
            formSheet: sheet,
        }))
    }

    /**
     * Disables any character sheet forms
     */
    disableCharacterSheetForm() {
        this.setState((initialState) => ({
            characterSheetCreatorEnabled: false,
            characterSheetEditorEnabled: false,
            formSheet: emptySheet,
        }))
    }

    render() {
        const classes = this.props.classes;
        var sortedSheets = this.props.sheet.sheets;
        sortedSheets = sortedSheets.filter((sheet) => {
            return (sheet.characterName.toLowerCase().includes(this.state.search.toLowerCase()));
        })

        return (
            <div className={classes.root}>
                {this.state.characterSheetCreatorEnabled && (
                    <CharacterSheetForm
                        handleClose={this.disableCharacterSheetForm.bind(this)}
                        type={this.state.characterSheetCreatorEnabled ? ("Create") : ("Edit")}
                        refreshCharacterSheets={this.props.retrieveCharacterSheetsForCurrentUser.bind(this)}
                        formSheet={emptySheet}
                    />
                )}

                {this.state.characterSheetEditorEnabled && (
                    <CharacterSheetForm
                        handleClose={this.disableCharacterSheetForm.bind(this)}
                        type={this.state.characterSheetCreatorEnabled ? ("Create") : ("Edit")}
                        refreshCharacterSheets={this.props.retrieveCharacterSheetsForCurrentUser}
                        formSheet={this.state.formSheet}
                    />
                )}

                <Typography variant='h2'>Character sheet gallery</Typography>
                <div className={classes.sortContainer}>
                    <Grid className={classes.characterSheetList}
                        container
                        spacing={3}
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <TextField label="Search" variant="standard" className={classes.searchField}
                                type='text'
                                onChange={(event) => { this.setState({ search: event.target.value }) }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon></SearchIcon>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
                {this.props.sheet.deletePending &&
                    <div style={{ marginTop: 20 }}>
                        <Typography variant="body1" gutterBottom>Deleting...</Typography>
                        <CircularProgress size={25} />
                    </div>
                }
                {this.props.sheet.retrievePending ?
                    <div style={{ marginTop: 20 }}>
                        <Typography variant="body1" gutterBottom>Sheets are loading...</Typography>
                        <CircularProgress />
                    </div> :
                    this.props.sheet.sheets.length === 0 ? // Should return message if user doesn't own sheets
                        <Typography variant="body1" style={{ marginTop: 20 }}>Uh oh! It looks like you don't have any sheets!</Typography> :
                        <div>
                            {this.state.search !== "" && // Search prompt "Searching for ..."
                                <div>
                                    <Typography style={{ marginTop: 20 }}>Searching for "{this.state.search}"</Typography>
                                    <Typography>{sortedSheets.length === 0 ? "No results found!" : "Found " + sortedSheets.length + " match!"}</Typography>
                                </div>}
                            <Grid className={classes.characterSheetList}
                                container
                                spacing={3}
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                {sortedSheets.map((sheet, index) => (
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
                                                <Button onClick={() => { this.props.history.push("/character-sheet/" + sheet._id) }}>View</Button>
                                                <Button onClick={() => { this.enableCharacterSheetEditor(sheet) }}>Edit</Button>
                                                <Button onClick={() => { this.props.deleteCharacterSheetForCurrentUser(sheet._id) }}>Delete</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                }
                <IconButton className={classes.createButton} onClick={this.enableCharacterSheetCreator.bind(this)} variant="outlined">
                    <AddIcon fontSize="large"></AddIcon>
                </IconButton>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    sheet: state.sheet
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCurrentUser: fetchCurrentUser,
    retrieveCharacterSheetsForCurrentUser: retrieveCharacterSheetsForCurrentUser,
    deleteCharacterSheetForCurrentUser: deleteCharacterSheetForCurrentUser,
    updateCharacterSheetForCurrentUser: updateCharacterSheetForCurrentUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(CharacterSheetGalleryPage)));