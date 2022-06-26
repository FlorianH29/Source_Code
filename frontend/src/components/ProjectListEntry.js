import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Divider, Grid, Typography, withStyles} from '@material-ui/core';
import {Button, ListItem} from "@mui/material";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import EditIcon from '@mui/icons-material/Edit';
import ProjectDeleteDialog from "./dialogs/ProjectDeleteDialog";
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import {Link as RouterLink, withRouter} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import {HdMWebAppAPI} from "../api";
import ProjectDurationDialog from "./dialogs/ProjectDurationDialog";


/**
 * Rendert ein ProjectBO innerhalb eines Eintrags der ProjectListe
 * In Zukunft theoretisch Funkionen zur Manipulationmeinzelner ProjectBO´s
 */


class ProjectListEntry extends Component {

    constructor(props) {
        super(props);

        //Zunächst den State initialisieren

        this.state = {
            project: props.project,
            person: '',
            startEvent: "", //props.startDate,
            endEvent: "",//props.endDate,
            showProjectCreateDialog: false,
            showProjectDeleteDialog: false,
            showProjectDurationDialog: false,
        }
    }

    /** Behandelt das onClick Event des Project bearbeiten Buttons */
    editProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectCreateDialog: true,

        });
    }

    /** Behandelt das onClick Event des Project bearbeiten Buttons */
    editProjectDurationButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectDurationDialog: true,
        });
    }

    /** Behandelt das onClick Event des Project löschen Buttons */
    deleteProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectDeleteDialog: true
        });
    }

    /** Behandelt das onClose Event von ProjectDeleteDialog */
    deleteProjectDialogClosed = (project) => {
        if (project) {
            this.props.onProjectDeleted(project);
        }
        this.setState({
            showProjectDeleteDialog: false // Den Dialog nicht mehr anzeigen
        });
    }

    /** Methode für das onClickEvent des BearbeitenButton von Project*/
    projectCreateDialogClosed = (project) => {

        // projectWork ist nicht null und wurde dementsprechend geändert
        if (project) {
            this.setState({
                project: project,
                showProjectCreateDialog: false
            });
        } else {
            this.setState({
                showProjectCreateDialog: false
            });
        }
    }

    getAPerson = () => {
        HdMWebAppAPI.getAPI().getPerson()
            .then(personBO =>
                this.setState({
                    person: personBO,
                })).catch(e =>
            this.setState({
                person: null,
            })
        );
    }

    /** Methode für das onClickEvent des BearbeitenButton von Project*/
    projectDurationDialogClosed = () => {
        this.setState({showProjectDurationDialog: false})
        this.getStartEventOfProject();
        this.getEndEventOfProject();
    }

    componentDidMount() {
        this.getStartEventOfProject();
        this.getEndEventOfProject();
        this.getAPerson();
    }


    /** Gibt das Start-Event dieses Projekts zurück */
    getStartEventOfProject = () => {
        HdMWebAppAPI.getAPI().getStartEvent(this.props.project.getID()).then(startEvent =>
            this.setState({
                startEvent: startEvent,
            })).catch(e =>
            this.setState({ // Reset state with error from catch
                startEvent: null,
            })
        );
    }


    /** Gibt das Start-Event dieses Projekts zurück */
    getEndEventOfProject = () => {
        HdMWebAppAPI.getAPI().getEndEvent(this.props.project.getID()).then(endEvent =>
            this.setState({
                endEvent: endEvent,

            })).catch(e =>
            this.setState({ // Reset state with error from catch
                endEvent: null,
            })
        );
    }


    /** Rendert die Komponente*/
    render() {
        const {classes} = this.props;
        const {
            project,
            showProjectCreateDialog,
            showProjectDeleteDialog,
            showProjectDurationDialog,
            startEvent,
            endEvent,
            person
        } = this.state;

        //console.log(startEvent)
        console.log(this.state)

        return (
            <div>
                <ListItem>
                    <Grid container alignItems={"center"}>
                        <ListItemButton component={RouterLink} to={{
                            pathname: `/activities`,
                            pro: {
                                project: project
                            },
                            per: {
                                person: person
                            }
                        }}>
                            <Grid item xs={3} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {project.getProjectName()}
                                </Typography>
                            </Grid>
                        </ListItemButton>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getClient()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <ListItemButton onClick={this.editProjectDurationButtonClicked}>
                                <Typography variant={"h5"} component={"div"}>
                                    Vom {new Date(startEvent.time_stamp).toLocaleString('de-DE', {
                                    dateStyle: "long",
                                })} bis zum {new Date(endEvent.time_stamp).toLocaleString(
                                    'de-DE', {
                                        dateStyle: "long",
                                    })}
                                </Typography>
                            </ListItemButton>
                        </Grid>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getWorkTime()} h
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"center"}>
                            <Button color='primary' size='small' startIcon={<EditIcon/>}
                                    onClick={this.editProjectButtonClicked}> </Button>
                            <Button color='secondary' size='small' startIcon={<RemoveCircleOutlineRoundedIcon/>}
                                    onClick={this.deleteProjectButtonClicked}> </Button>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <ProjectCreateDialog show={showProjectCreateDialog} project={project}
                                     onClose={this.projectCreateDialogClosed}/>
                <ProjectDeleteDialog project={project} show={showProjectDeleteDialog}
                                     onClose={this.deleteProjectDialogClosed}/>
                <ProjectDurationDialog startPoint={startEvent} endPoint={endEvent}
                                       show={showProjectDurationDialog} onClose={this.projectDurationDialogClosed}
                />
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

/** PropTypes */
ProjectListEntry.propTypes = {
    /** Das ProjectBO welches gerendert werden soll */
    project: PropTypes.object.isRequired,
    /** Event Handler Funktion, welche aufgerufen wird, nachdem ein Projekt erfolgreich gelöscht wurde. */
    onProjectDeleted: PropTypes.func.isRequired
}

export default withRouter(withStyles(styles)(ProjectListEntry));