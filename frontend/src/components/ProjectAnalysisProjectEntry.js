import React, {Component} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography, withStyles} from '@material-ui/core';
import {HdMWebAppAPI} from "../api";
import ProjectAnalysisActivityList from "./ProjectAnalysisActivityList";


/**
 * Rendert ein ProjectBO innerhalb eines Eintrags der ProjectListe
 * In Zukunft theoretisch Funkionen zur Manipulationmeinzelner ProjectBO´s
 */


class ProjectAnalysisProjectEntry extends Component {

    constructor(props) {
        super(props);

        //Zunächst den State initialisieren

        this.state = {
            project: props.project,
            activities: [],
            workTimeProject: 0,
        }
    }

    /** Gibt die Arbeitsleistung für ein Project in einen gegebenen Zeitraum zurück */
    getWorkTimeProject = () => {
        if (this.state.project.getID() > 0) {
            HdMWebAppAPI.getAPI().getProjectWorkTime(this.state.project.getID(), this.props.startDate, this.props.endDate).then(workTimeProject => this.setState({
                workTimeProject: workTimeProject,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    workTimeProject: null,
                })
            );
        }
    }

    componentDidMount() {
        this.getWorkTimeProject();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props != prevProps) {
            this.getWorkTimeProject();
        }
    }

    secondsToString(seconds) {
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        let totalMinutes = seconds / 60 >> 0;
        let minutes = totalMinutes % 60;
        let hours = totalMinutes / 60 >> 0;
        return zeroPad(hours, 2) + ":" + zeroPad(minutes, 2)
    }

    /** Rendert die Komponente*/
    render() {
        const {project, workTimeProject} = this.state;
        return (
            <div style={{width: "100%", p: 0, m: 0}}>
                <Accordion style={{width: "100%", p: 0, m: 0}}>
                    <AccordionSummary>
                        <Grid container alignItems={"center"} spacing={2}>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {project.getProjectName()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {project.getClient()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {this.secondsToString(workTimeProject)} h
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ProjectAnalysisActivityList project={project} startDate={this.props.startDate}
                                                     endDate={this.props.endDate}/>
                    </AccordionDetails>
                </Accordion>
                <Divider/>
            </div>
        );
    }
}

/** Kompontenen spezifische Styles*/
const styles = theme => ({
    root: {
        width: '100%',
    },
});

export default withStyles(styles)(ProjectAnalysisProjectEntry);