import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import axios from 'axios';

import {
    MenuItem,
    Paper,
    Button,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Divider,
    FormControlLabel,
    Checkbox,
    Dialog,
    FormHelperText,
    CircularProgress,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { fetchCurrentUser } from '../../redux/actions/userActions';
import { setLightMode } from '../../redux/actions/lightModeActions';
import { bindActionCreators } from 'redux';
import { createCharacterSheetForCurrentUser, updateCharacterSheetForCurrentUser } from './../../redux/actions/characterSheetActions';

const styles = (theme) => ({
    container: {
        textAlign: 'left',
        padding: 50
    },
})

class CharacterSheetForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...props.formSheet, detailsError: "", started: false };
    }

    componentDidUpdate(){
        if(this.state.started && !this.props.sheet.createPending && !this.props.sheet.updatePending){
            this.props.handleClose();
        }
    }

    setFeatsAndSpells(item) {
        this.setState({ featsAndSpells: [...this.state.featsAndSpells, item] })
    }

    removeItemFromFeatsAndSpells(index) {
        this.setState({
            featsAndSpells: this.state.featsAndSpells.filter((item, indexItem) => {
                return index !== indexItem;
            })
        })
    }

    setProficiencies(item) {
        this.setState({ proficiencies: [...this.state.featsAndSpells, item] })
    }

    removeItemFromProficiencies(index) {
        this.setState({
            proficiencies: this.state.featsAndSpells.filter((item, indexItem) => {
                return index !== indexItem;
            })
        })
    }

    createCharacterSheetFromState() {
        var characterSheet = {};
        characterSheet.ownerEmail = this.props.user.currentUser.email;
        characterSheet.avatar = 0;
        characterSheet.characterName = this.state.characterName;
        characterSheet.experience = this.state.experience;
        characterSheet.race = this.state.race;
        characterSheet.background = this.state.background;
        characterSheet.class = this.state.class;
        characterSheet.alignment = this.state.alignment;
        characterSheet.armourClass = this.state.armourClass;
        characterSheet.health = {
            currentHealth: this.state.health.currentHealth,
            maxHealth: this.state.health.maxHealth
        };
        characterSheet.hitDice = {
            currentHitDice: this.state.hitDiceMax,
            maxHitDice: this.state.hitDice.hitDiceMax,
            hitDiceType: this.state.hitDice.hitDiceType
        };
        characterSheet.stats = {
            strength: this.state.stats.strength,
            dexterity: this.state.stats.dexterity,
            constitution: this.state.stats.constitution,
            intelligence: this.state.stats.intelligence,
            wisdom: this.state.stats.wisdom,
            charisma: this.state.stats.charisma
        };
        characterSheet.skills = {
            acrobatics: this.state.skills.acrobatics,
            animalHandling: this.state.skills.animalHandling,
            arcana: this.state.skills.arcana,
            athletics: this.state.skills.athletics,
            deception: this.state.skills.deception,
            history: this.state.skills.history,
            insight: this.state.skills.insight,
            intimidation: this.state.skills.intimidation,
            investigation: this.state.skills.investigation,
            medicine: this.state.skills.medicine,
            nature: this.state.skills.nature,
            perception: this.state.skills.perception,
            performance: this.state.skills.performance,
            persuasion: this.state.skills.persuasion,
            religion: this.state.skills.religion,
            sleightOfHand: this.state.skills.sleightOfHand,
            stealth: this.state.skills.stealth,
            survival: this.state.skills.survival
        };

        characterSheet.featsAndSpells = this.state.featsAndSpells;

        characterSheet.proficiencies = this.state.proficiencies;
        characterSheet.equipment = this.state.equipment;
        characterSheet.description = this.state.description;
        return characterSheet;
    }

    checkIfEmpty() {
        if (this.state.characterName === "") {
            this.setState({ detailsError: "Please fill in the character name." })
            return false;
        } else {
            return true;
        }
    }

    render() {
        const classes = this.props.classes;

        return (
            <Dialog elevation={6} open={true}>
                <div className={classes.container}>
                    <Typography variant="h3">{this.props.type} a character</Typography>
                    <Divider></Divider>

                    <Typography variant="h5" style={{ marginTop: 50 }}> Details </Typography>
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="center"

                    >
                        <Grid item>
                            <TextField
                                label="Character Name"
                                value={this.state.characterName}
                                onChange={(event) => { this.setState({ characterName: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Race"
                                value={this.state.race}
                                onChange={(event) => { this.setState({ race: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Background"
                                value={this.state.background}
                                onChange={(event) => { this.setState({ background: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl style={{ minWidth: 150 }}>
                                <InputLabel>Alignment</InputLabel>
                                <Select
                                    value={this.state.alignment}
                                    onChange={(event) => {
                                        this.setState({ alignment: event.target.value })
                                    }}
                                >
                                    <MenuItem value={""}><em>None</em></MenuItem>
                                    <MenuItem value={"Lawful Good"}>Lawful Good</MenuItem>
                                    <MenuItem value={"Neutral Good"}>Neutral Good</MenuItem>
                                    <MenuItem value={"Chaotic Good"}>Chaotic Good</MenuItem>
                                    <MenuItem value={"Lawful Neutral"}>Lawful Neutral</MenuItem>
                                    <MenuItem value={"True Neutral"}>True Neutral</MenuItem>
                                    <MenuItem value={"Chaotic Neutral"}>Chaotic Neutral</MenuItem>
                                    <MenuItem value={"Lawful Evil"}>Lawful Evil</MenuItem>
                                    <MenuItem value={"True Evil"}>True Evil</MenuItem>
                                    <MenuItem value={"Chaotic Evil"}>Chaotic Evil</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        style={{ marginTop: 20 }}
                    >
                        <Grid item>
                            <TextField
                                label="Class"
                                value={this.state.class}
                                onChange={(event) => { this.setState({ class: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Experience"
                                type="number"
                                value={this.state.experience}
                                style={{ maxWidth: 100 }}
                                onChange={(event) => { this.setState({ experience: parseInt(event.target.value) }) }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="HP"
                                type="number"
                                value={this.state.health.maxHealth}
                                style={{ maxWidth: 80 }}
                                onChange={(event) => {
                                    var newValue = parseInt(event.target.value);
                                    this.setState((initialState) => ({ health: { ...initialState.health, maxHealth: newValue } }))
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="AC"
                                type="number"
                                value={this.state.armourClass}
                                style={{ maxWidth: 80 }}
                                onChange={(event) => { this.setState({ armourClass: parseInt(event.target.value) }) }}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl style={{ minWidth: 100 }}>
                                <InputLabel>Hit Dice</InputLabel>
                                <Select
                                    value={this.state.hitDice.hitDiceType}
                                    onChange={(event) => {
                                        var newValue = parseInt(event.target.value);
                                        this.setState((initialState) => ({ hitDice: { ...initialState.hitDice, hitDiceType: newValue } }))
                                    }}
                                >
                                    <MenuItem value={4}>D4</MenuItem>
                                    <MenuItem value={6}>D6</MenuItem>
                                    <MenuItem value={8}>D8</MenuItem>
                                    <MenuItem value={10}>D10</MenuItem>
                                    <MenuItem value={12}>D12</MenuItem>
                                    <MenuItem value={20}>D20</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Typography variant="h5" style={{ marginTop: 50 }} gutterBottom>Stats</Typography>
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="center"
                    >
                        {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat, index) => (
                            <Grid item key={index}>
                                <TextField
                                    label={stat.substring(0, 3).toUpperCase()}
                                    type="number"
                                    value={this.state.stats[stat]}
                                    style={{ maxWidth: 80 }}
                                    onChange={(event) => {
                                        var newValue = parseInt(event.target.value);
                                        this.setState((initialState) => ({ stats: { ...initialState.stats, [stat]: newValue } }));
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h5" style={{ marginTop: 50 }}>Skills</Typography>
                    <Grid container
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        style={{ maxWidth: 800 }}
                    >
                        {["acrobatics", "animalHandling", "arcana", "athletics",
                            "deception", "history", "insight", "intimidation",
                            "investigation", "nature", "perception",
                            "performance", "persuasion", "religion", "sleightOfHand",
                            "stealth", "survival"
                        ].map((skill, index) => (
                            <Grid item key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.skills[skill]}
                                            onChange={(event) => {
                                                var newValue = event.target.checked;
                                                this.setState((initialState) => ({ skills: { ...initialState.skills, [skill]: newValue } }))
                                            }}
                                            name={skill}
                                        />
                                    }
                                    label={
                                        skill
                                            // insert a space before all caps
                                            .replace(/([A-Z])/g, ' $1')
                                            // uppercase the first character
                                            .replace(/^./, function (str) { return str.toUpperCase(); })
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h5" style={{ marginTop: 50 }} gutterBottom>Description</Typography>
                    <TextField
                        multiline
                        fullWidth
                        label="Description"
                        variant="outlined"
                        rows={10}
                        value={this.state.description}
                        onChange={(event) => { this.setState({ description: event.target.value }) }} />

                    <Typography variant="h5" style={{ marginTop: 50 }} gutterBottom>Proficiencies</Typography>
                    <TextField
                        multiline
                        fullWidth
                        label="Proficiencies"
                        variant="outlined"
                        rows={7}
                        value={this.state.proficiencies}
                        onChange={(event) => { this.setState({ proficiencies: event.target.value }) }} />

                    <Typography variant="h5" style={{ marginTop: 50 }} gutterBottom>Equipment</Typography>
                    <TextField
                        multiline
                        fullWidth
                        label="Equipment"
                        variant="outlined"
                        rows={7}
                        value={this.state.equipment}
                        onChange={(event) => { this.setState({ equipment: event.target.value }) }} />

                    <TextMapForm
                        title="Feats, Spells and Racial Traits"
                        textMap={this.state.featsAndSpells}
                        setTextMap={this.setFeatsAndSpells.bind(this)}
                        removeItemFromTextMap={this.removeItemFromFeatsAndSpells.bind(this)}
                    />
                    <br></br>
                    <FormHelperText error textalign="center">{this.state.detailsError}</FormHelperText>
                    <Divider></Divider>
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        style={{ marginTop: 2 }}
                    >

                        <Grid item>
                            <Button
                                onClick={() => {
                                    if (this.checkIfEmpty()) {
                                        if (this.state._id === null) {
                                            this.props.createCharacterSheetForCurrentUser(this.createCharacterSheetFromState());
                                        } else {
                                            this.props.updateCharacterSheetForCurrentUser(this.state._id, this.createCharacterSheetFromState());
                                        }
                                        this.setState({started: true})
                                    }
                                }}
                                color="primary"
                                variant="contained"
                            >
                                {(this.props.sheet.createPending || this.props.sheet.updatePending) ? <CircularProgress color="inherit" size={25}/> : this.props.type + " Character"}
                                </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => {
                                this.props.handleClose();
                            }} color="primary" variant="contained">
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
        );
    }
}

function TextMapForm(props) {
    const { textMap, setTextMap, removeItemFromTextMap } = props;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div style={{ marginTop: 50 }}>
            <Typography variant="h5" gutterBottom>{props.title}</Typography>
            <Paper elevation={6} style={{ marginTop: 30, marginBottom: 30, textAlign: 'center', minHeight: 300, padding: 20 }}>
                {textMap.length === 0 ? <Typography>There aren't any fields added. Add them by pressing the Add Item button.</Typography> :
                    textMap.map((item, index) => (
                        <div key={index}>
                            {index !== 0 && <Divider></Divider>}
                            <Typography align="center" variant="body1">{item.name}</Typography>
                            {item.description.split(/\r?\n/).map((line, index) => (
                                <Typography key={index} align="center" variant="body2">{line}</Typography>
                            ))}

                            <Button onClick={() => { removeItemFromTextMap(index) }}>Remove {item.name}</Button>
                        </div>
                    ))
                }
            </Paper>
            <TextField
                label="Name"
                variant="outlined"
                style={{ marginBottom: 10 }}
                onChange={(event) => { setName(event.target.value) }} />
            <TextField
                label="Description"
                multiline
                style={{ marginBottom: 10 }}
                rows={5}
                fullWidth
                variant="outlined"
                onChange={(event) => { setDescription(event.target.value) }} />
            <Button
                variant='outlined'
                onClick={() => {
                    if (name !== "" && description !== "") {
                        setTextMap({ name: name, description: description })
                    }
                }}>Add Item</Button>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user,
    sheet: state.sheet
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCurrentUser: fetchCurrentUser,
    setLightMode: setLightMode,
    createCharacterSheetForCurrentUser: createCharacterSheetForCurrentUser,
    updateCharacterSheetForCurrentUser: updateCharacterSheetForCurrentUser,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(CharacterSheetForm)));