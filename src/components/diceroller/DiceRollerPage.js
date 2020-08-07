import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Card, Paper, Grid, TextField, FormControlLabel, Divider, Checkbox, InputLabel, Select, FormControl, MenuItem, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { retrieveCharacterSheetsForCurrentUser, deleteCharacterSheetForCurrentUser, updateCharacterSheetForCurrentUser } from './../../redux/actions/characterSheetActions';
import { fetchCurrentUser } from '../../redux/actions/userActions';

const styles = theme => ({
    root: {
        padding: theme.spacing(5),
        minHeight: 700,
        textAlign: 'center',
    },
    diceDisplay: {
        padding: theme.spacing(5),
        minHeight: 150,
        textAlign: 'left',
        margin: 'auto'
    },
    section: {
        padding: theme.spacing(5),
        minHeight: 150,
        maxWidth: 800,
        textAlign: 'left',
        margin: 'auto'
    },
})

/**
 * If the user is logged in, the dice roller page will allow the user to roll dice based on a selected character.
 * Otherwise, it is just a simple dice roller.
 */
const blankStatsAndSkills = {
    experience: 0,

    // All stats
    stats: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
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
}

class DiceRollerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Roll Type
            rollType: "normal",
            statRollType: "strength",
            statRollProficient: false,
            skillRollType: "acrobatics",
            skillRollProficient: false,
            customRollModifier: 0,

            // Dice rolling
            dice: [],
            diceResults: [],

            // Sheet index
            sheetIndex: -1,

            // All stats and skills
            level: this.calculateLevelFromExperience(blankStatsAndSkills.level),
            stats: blankStatsAndSkills.stats,
            skills: blankStatsAndSkills.skills
        }
    }

    componentDidMount() {
        this.props.retrieveCharacterSheetsForCurrentUser();
    }

    getProficiencyBonus() {
        if (!this.state.level) {
            return 2;
        }
        if (this.state.level <= 1) {
            return 2;
        }
        return Math.ceil(1 + this.state.level / 4);
    }

    /**
     * Calculates the modifier of a stat, given its name
     * @param statName name (e.g. strength)
     */
    getStatModifier(statName) {
        if (!this.state.stats[statName]) {
            return 0;
        }
        return Math.floor((this.state.stats[statName] - 10) / 2);
    }

    /**
     * Gets the modifier string representation, from a modifier value (e.g. 40 returns "(+40)", -30 returns "(-30)")
     * @param mod 
     */
    getModifierStringRepresentation(mod) {
        var sign = "";
        if (mod >= 0) {
            sign = "+";
        } else if (mod < 0) {
            sign = "";
        }
        return " (" + sign + mod + ")"
    }

    /**
     * Calculate the modifier of a skill, given its name
     * @param skillName name (e.g. athletics)
     */
    getSkillModifier(skillName) {
        var skill = this.state.skills[skillName];
        if (!skill) {
            return 0;
        } else {
            switch (skillName) {
                case "athletics":
                    return this.getStatModifier("strength");
                case "acrobatics":
                case "sleightOfHand":
                case "stealth":
                    return this.getStatModifier("dexterity");
                case "arcana":
                case "history":
                case "investigation":
                case "nature":
                case "religion":
                    return this.getStatModifier("intelligence");
                case "animalHandling":
                case "insight":
                case "medicine":
                case "perception":
                case "survival":
                    return this.getStatModifier("wisdom");
                case "deception":
                case "intimidation":
                case "performance":
                case "persuasion":
                    return this.getStatModifier("charisma");
            }
        }
        return 0;
    }

    calculateLevelFromExperience(exp) {
        const levelRequirements = [355000, 305000, 265000, 225000, 195000, 165000, 140000, 120000, 100000, 85000, 64000, 48000, 34000, 23000, 14000, 6500, 2700, 900, 300, 0];
        for (var i = 0; i < levelRequirements.length; i++) {
            if (exp >= levelRequirements[i]) {
                return 20 - i;
            }
        }
        return 0;
    }

    updateStateUsingSheet(sheet) {
        this.setState((initialState) => ({ ...initialState, level: this.calculateLevelFromExperience(sheet.experience), stats: sheet.stats, skills: sheet.skills }));
    }

    rollDice() {
        var diceResults = [];
        for (var i = 0; i < this.state.dice.length; i++) {
            var diceResult = Math.ceil(Math.random() * this.state.dice[i]);
            diceResults.push(diceResult);
        }
        this.setState((initialState) => ({ ...initialState, diceResults: diceResults }));
    }

    clearDice() {
        this.setState((initialState) => ({ ...initialState, dice: [], diceResults: [] }));
    }

    addDice(diceType) {
        if (this.state.diceResults.length === 0) {
            this.setState((initialState) => ({ ...initialState, dice: [...initialState.dice, diceType] }));
        }
    }

    getOverallDiceResultAmount() {
        var diceTotal = 0;
        var modifier = 0;

        switch (this.state.rollType) {
            case "normal":
                break;
            case "stat":
                if (this.state.statRollProficient) {
                    modifier += this.getProficiencyBonus();
                }
                modifier += this.getStatModifier(this.state.statRollType);
                break;
            case "skill":
                if (this.state.skillRollProficient) {
                    modifier += this.getProficiencyBonus();
                }
                modifier += this.getSkillModifier(this.state.skillRollType);
                break;
            case "custom":
                modifier += this.state.customRollModifier;
                break;
        }

        for (var i = 0; i < this.state.diceResults.length; i++) {
            diceTotal += this.state.diceResults[i];
        }
        diceTotal += modifier;

        return diceTotal;
    }

    getOverallDiceResultString() {
        var diceTotal = 0;
        var description = "";
        var modifier = 0;

        switch (this.state.rollType) {
            case "normal":
                description = "Normal roll";
                break;
            case "stat":
                description = this.state.statRollType
                    // uppercase the first character
                    .replace(/^./, function (str) { return str.toUpperCase(); }) + " roll";
                if (this.state.statRollProficient) {
                    description += ", with proficiency";
                    modifier += this.getProficiencyBonus();
                }
                modifier += this.getStatModifier(this.state.statRollType);
                break;
            case "skill":
                description = this.state.skillRollType
                    // insert a space before all caps
                    .replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, function (str) { return str.toUpperCase(); }) + " roll";
                if (this.state.skillRollProficient) {
                    description += ", with proficiency";
                    modifier += this.getProficiencyBonus();
                }
                modifier += this.getSkillModifier(this.state.skillRollType);
                break;
            case "custom":
                description = "Custom roll";
                modifier += this.state.customRollModifier;
                break;
        }
        description += ". Modifier: " + modifier;

        for (var i = 0; i < this.state.diceResults.length; i++) {
            diceTotal += this.state.diceResults[i];
        }
        diceTotal += modifier;

        return "Roll Total: " + diceTotal + ", " + description;
    }

    render() {
        const classes = this.props.classes;
        var sheets = this.props.sheet.sheets;
        var user = this.props.user.currentUser;

        return (
            <div className={classes.root}>
                <Paper className={classes.section}>
                    <div className={classes.diceDisplay}>
                        {this.state.diceResults.length !== 0 &&
                            <div>
                                <Typography variant="h2" align="center">You rolled a:</Typography>
                                <Typography style={{ marginBottom: 50 }} variant="h1" align="center">{this.getOverallDiceResultAmount()}</Typography>
                            </div>
                        }
                        {this.state.dice.length === 0 ?
                            <Typography align="center">Dice list is empty. Add some dice from the Dice section below.</Typography>
                            :
                            this.state.dice.map((value, index) =>
                                <Typography key={index} align="center">- D{value} {this.state.diceResults.length === 0 ? "" : " - Rolled " + this.state.diceResults[index]}</Typography>
                            )
                        }
                        {this.state.diceResults.length !== 0 &&
                            <Typography align="center"><br />{this.getOverallDiceResultString()}</Typography>
                        }
                    </div>

                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="flex-end"
                        justify="center">
                        {this.state.diceResults.length === 0 &&
                            <Grid item>
                                <FormControl style={{ minWidth: 120 }}>
                                    <InputLabel>{"Roll Type"}</InputLabel>
                                    <Select
                                        value={this.state.rollType}
                                        onChange={(event) => {
                                            var newValue = event.target.value;
                                            this.setState((initialState) => ({
                                                rollType: newValue,
                                                statRollType: "strength",
                                                statRollProficient: false,
                                                skillRollType: "acrobatics",
                                                skillRollProficient: false,
                                                customRollModifier: 0,
                                            }))
                                        }}
                                    >
                                        <MenuItem value={"normal"}>Normal Roll</MenuItem>
                                        <MenuItem value={"stat"}>Stat Roll</MenuItem>
                                        <MenuItem value={"skill"}>Skill Roll</MenuItem>
                                        <MenuItem value={"custom"}>Custom Roll</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        {this.state.rollType === "stat" && this.state.diceResults.length === 0 &&
                            <Grid item>
                                <FormControl style={{ minWidth: 120 }}>
                                    <InputLabel>{"Stat"}</InputLabel>
                                    <Select
                                        value={this.state.statRollType}
                                        onChange={(event) => {
                                            var newValue = event.target.value;
                                            this.setState((initialState) => ({ statRollType: newValue }))
                                        }}
                                    >
                                        {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat, index) => (
                                            <MenuItem key={index} value={stat}>{stat.substring(0, 3).toUpperCase() + this.getModifierStringRepresentation(this.getStatModifier(stat))}</MenuItem>
                                        ))};
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        {
                            this.state.rollType === "stat" && this.state.diceResults.length === 0 &&
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.statRollProficient}
                                            onChange={(event) => {
                                                var newValue = event.target.checked;
                                                this.setState((initialState) => ({ statRollProficient: newValue }))
                                            }}
                                        />
                                    }
                                    label={
                                        "Proficient" + (this.state.statRollProficient ? this.getModifierStringRepresentation(this.getProficiencyBonus()) : " (+0)")
                                    }
                                />
                            </Grid>
                        }
                        {this.state.rollType === "skill" && this.state.diceResults.length === 0 &&
                            <Grid item>
                                <FormControl style={{ minWidth: 120 }}>
                                    <InputLabel>{"Stat"}</InputLabel>
                                    <Select
                                        value={this.state.skillRollType}
                                        onChange={(event) => {
                                            var newValue = event.target.value;
                                            this.setState((initialState) => ({ skillRollType: newValue }))
                                        }}
                                    >
                                        {["acrobatics", "animalHandling", "arcana", "athletics",
                                            "deception", "history", "insight", "intimidation",
                                            "investigation", "nature", "perception",
                                            "performance", "persuasion", "religion", "sleightOfHand",
                                            "stealth", "survival"
                                        ].map((skill, index) => (
                                            <MenuItem key={index} value={skill}>{
                                                skill
                                                    // insert a space before all caps
                                                    .replace(/([A-Z])/g, ' $1')
                                                    // uppercase the first character
                                                    .replace(/^./, function (str) { return str.toUpperCase(); })
                                                + (this.state.skills[skill] ? (" " + this.getModifierStringRepresentation(this.getSkillModifier(skill))) : " (+0)")}
                                            </MenuItem>
                                        ))};
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        {
                            this.state.rollType === "skill" && this.state.diceResults.length === 0 &&
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.skillRollProficient}
                                            onChange={(event) => {
                                                var newValue = event.target.checked;
                                                this.setState((initialState) => ({ skillRollProficient: newValue }))
                                            }}
                                        />
                                    }
                                    label={
                                        "Proficient" + (this.state.skillRollProficient ? this.getModifierStringRepresentation(this.getProficiencyBonus()) : " (+0)")
                                    }
                                />
                            </Grid>
                        }
                        {this.state.rollType === "custom" && this.state.diceResults.length === 0 &&
                            <Grid item>
                                <TextField
                                    label="Modifier"
                                    type="number"
                                    value={this.state.customRollModifier}
                                    style={{ maxWidth: 80 }}
                                    onChange={(event) => {
                                        var newValue = parseInt(event.target.value);
                                        this.setState((initialState) => ({ customRollModifier: newValue }));
                                    }}
                                />
                            </Grid>
                        }
                    </Grid>
                    <br />
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="flex-end"
                        justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={this.rollDice.bind(this)}>Roll</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={this.clearDice.bind(this)}>Clear</Button>
                        </Grid>
                    </Grid>
                </Paper>
                <br />
                <Paper className={classes.section}>
                    <Typography variant="h5">Dice</Typography>
                    <Divider style={{ marginBottom: 20 }}></Divider>
                    {[4, 6, 8, 10, 12, 20, 100].map((value, index) => (
                        <Button style={{ margin: 4 }} key={index} variant="outlined" onClick={() => this.addDice(value)}>{"d" + value}</Button>
                    ))}
                </Paper>
                <br />
                <Paper className={classes.section}>
                    <Typography variant="h5">Stats and Skills</Typography>
                    <Divider style={{ marginBottom: 20, marginTop: 20 }}></Divider>
                    {user ?
                        <FormControl style={{ minWidth: 250 }}>
                            <InputLabel>{"Select Character Sheet To Import"}</InputLabel>
                            <Select
                                value={this.state.sheetIndex}
                                onChange={(event) => {
                                    var newValue = parseInt(event.target.value);
                                    this.setState((initialState) => ({ sheetIndex: newValue }))
                                    if (newValue !== -1) {
                                        this.updateStateUsingSheet(sheets[newValue]);
                                    } else {
                                        this.updateStateUsingSheet(blankStatsAndSkills);
                                    }
                                }}
                            >
                                <MenuItem value={-1}>None</MenuItem>
                                {sheets.map((sheet, index) => (
                                    <MenuItem key={index} value={index}>{sheet.characterName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        : <Typography>Log in to be able to import character sheet stats!</Typography>
                    }
                    <br />
                    <br />
                    <TextField
                        label={"Level" + this.getModifierStringRepresentation(this.getProficiencyBonus())}
                        type="number"
                        value={this.state.level}
                        style={{ maxWidth: 80 }}
                        onChange={(event) => {
                            var newValue = parseInt(event.target.value);
                            this.setState((initialState) => ({ ...initialState, level: newValue }))
                        }}
                    />
                    <br />
                    <br />
                    <Grid container
                        spacing={2}
                        direction="row"
                        alignItems="center"
                    >
                        {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat, index) => (
                            <Grid item key={index}>
                                <TextField
                                    label={stat.substring(0, 3).toUpperCase() + this.getModifierStringRepresentation(this.getStatModifier(stat))}
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
                    <br />
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
                            <Grid item key={index} xs={6}>
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
                                        + (this.state.skills[skill] ? (" " + this.getModifierStringRepresentation(this.getSkillModifier(skill))) : "")
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(DiceRollerPage)));