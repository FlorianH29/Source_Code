import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import {Button, ListItem} from "@mui/material";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import EditIcon from '@mui/icons-material/Edit';
import ProjectDeleteDialog from "./dialogs/ProjectDeleteDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import {HdMWebAppAPI} from "../api";



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
            showProjectCreateDialog: false,
            showProjectDeleteDialog: false,
            startEvent: "",
            endEvent: ""
        }
    }

    /** Behandelt das onClick Event des Project bearbeiten Buttons */
    editProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectCreateDialog: true
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

    componentDidMount() {
        this.getStartEventOfProject();
        this.getEndEventOfProject();
    }


    /** Gibt das Start-Event dieses Projekts zurück */
    getStartEventOfProject = () => {
        HdMWebAppAPI.getAPI().getStartEvent(this.props.project.getID()).then(startEvent =>
                this.setState({
                    startEvent: startEvent
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
                    endEvent: endEvent
                })).catch(e =>
                this.setState({ // Reset state with error from catch
                    endEvent: null,
                })
            );
    }




    /** Rendert die Komponente*/
    render() {
        const { classes } = this.props;
        const { project, showProjectCreateDialog, showProjectDeleteDialog, startEvent, endEvent } = this.state;

        console.log(startEvent)
        //console.log (classes)

        return(
            <div>
                <ListItem>
                    <Grid container alignItems={"center"}>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getProjectName()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getClient()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getWorkTime()} h
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                               Vom {new Date(startEvent.time_stamp).toLocaleString('de-DE', {
                                dateStyle: "long",})} bis zum {new Date(endEvent.time_stamp).toLocaleString('de-DE', {
    dateStyle: "long",

})}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Button color='primary' size='small' startIcon={<EditIcon />} onClick={this.editProjectButtonClicked}> </Button>
                            <Button color='secondary' size='small' startIcon={<DeleteIcon />} onClick={this.deleteProjectButtonClicked}> </Button>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <ProjectCreateDialog show={showProjectCreateDialog} project={project} onClose={this.projectCreateDialogClosed} />
                <ProjectDeleteDialog project={project} show={showProjectDeleteDialog} onClose={this.deleteProjectDialogClosed} />
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

export default withStyles(styles)(ProjectListEntry);