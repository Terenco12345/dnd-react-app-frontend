import React from 'react';
import axios from 'axios';
import { Typography, Paper, CircularProgress, Grid, Divider, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router';
import avatars from '../../avatars';

const styles = (theme) => ({
    root: {
        minHeight: 700,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        margin: 'auto',
        width: "100%",
        backgroundRepeat: 'no-repeat'
    },

    container: {
        margin: 'auto',
        textAlign: 'left',
        width: 1200,
        maxWidth: '98%',
    },

    multilineInfo: {
        padding: theme.spacing(4),
    },

    titleCardTitle: {
        width: '100%',
        height: 200,
        backgroundPosition: 'center',
        borderRadius: 10,
        textAlign: 'center',
        height: '100%',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        marginBottom: theme.spacing(2),
    },

    section: {
        marginBottom: theme.spacing(10)
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

    /**
     * Calculates the modifier of a stat, given its name
     * @param statName name (e.g. strength)
     */
    getStatModifier(statName) {
        return Math.floor((this.state.sheet.stats[statName] - 10) / 2);
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
        var skill = this.state.sheet.skills[skillName];
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

    render() {
        const classes = this.props.classes;
        const sheet = this.state.sheet;
        console.log(this.state.sheet);

        if (sheet === null) {
            return (
                <div style={{ textAlign: 'center', marginTop: 40, minHeight: 700 }}>
                    <CircularProgress></CircularProgress>
                </div>
            )
        } else {
            return (
                <div className={classes.root} style={avatars.characterSheetBackgrounds[sheet.avatar]}>
                    <div className={classes.container}>
                        <Paper className={classes.titleCardTitle}>
                            <Typography variant="h1">{sheet.characterName}</Typography>
                        </Paper>
                        <Paper className={classes.multilineInfo}>
                            <div className={classes.section}>
                                <Typography variant="h5">Details</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                <Grid container
                                    spacing={2}
                                    direction="row"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <TextField
                                            label="Character Name"
                                            value={sheet.characterName}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Race"
                                            value={sheet.race}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Background"
                                            value={sheet.background}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Alignment"
                                            value={sheet.alignment}
                                            onChange={() => { }}
                                        />
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
                                            value={sheet.class}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Level"
                                            value={this.calculateLevelFromExperience(sheet.experience)}
                                            style={{ maxWidth: 50 }}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Experience"
                                            value={sheet.experience}
                                            style={{ maxWidth: 100 }}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="HP"
                                            value={sheet.health.currentHealth + "/" + sheet.health.maxHealth}
                                            style={{ maxWidth: 120 }}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="AC"
                                            value={sheet.armourClass}
                                            style={{ maxWidth: 80 }}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Hit Dice Type"
                                            value={sheet.hitDice.currentHitDice + "/" + sheet.hitDice.maxHitDice + " D" + sheet.hitDice.hitDiceType}
                                            onChange={() => { }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Typography variant="h5">Stats</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                <Grid container
                                    spacing={2}
                                    direction="row"
                                    alignItems="center"
                                >
                                    {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat, index) => (
                                        <Grid item key={index}>
                                            <TextField
                                                label={stat.substring(0, 3).toUpperCase()}
                                                value={sheet.stats[stat] + this.getModifierStringRepresentation(this.getStatModifier(stat))}
                                                style={{ maxWidth: 80 }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Typography variant="h5">Skills</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
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
                                                    <Checkbox checked={sheet.skills[skill]}
                                                        onChange={() => { }}
                                                        name={skill}
                                                        disableRipple
                                                    />
                                                }
                                                label={
                                                    skill
                                                        // insert a space before all caps
                                                        .replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); })
                                                    + (sheet.skills[skill] ? (" " + this.getModifierStringRepresentation(this.getSkillModifier(skill))): "")
                                                }
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Typography variant="h5">Description</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                <Typography>{sheet.description}</Typography>
                            </div>

                            <div className={classes.section}>
                                <Typography variant="h5">Proficiencies</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                <Typography>{sheet.proficiencies}</Typography>
                            </div>

                            <div className={classes.section}>
                                <Typography variant="h5">Equipment</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                <Typography>{sheet.equipment}</Typography>
                            </div>

                            <div className={classes.section}>
                                <Typography variant="h5">Feats, Spells and Traits</Typography>
                                <Divider style={{ marginBottom: 20 }}></Divider>
                                {sheet.featsAndSpells.map((feat, index) => {
                                    return (
                                        <div key={index} style={{ marginBottom: 20 }}>
                                            <Typography variant="h6">{feat.name}</Typography>
                                            <Typography variant="body1">{feat.description}</Typography>
                                        </div>
                                    )
                                })}
                            </div>
                        </Paper>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(withStyles(styles)(CharacterSheetPage));