import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider, Box} from '@mui/material';
import ProjectListEntry from "./ProjectListEntry";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import PropTypes from "prop-types";
import ProjectDurationDialog from "./dialogs/ProjectDurationDialog";
import ViewsDatePicker from "./dialogs/ProjectDurationDialog";


class ProjectList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            showProjectCreateDialog: false,
            showProjectDurationDialog: false
        }
    }

    getProjects = () => {
        HdMWebAppAPI.getAPI().getProject(1)
            .then(projectBOs =>
                this.setState({
                    projects: projectBOs
                })).catch(e =>
            this.setState({
                projects: []
            }));
        //console.log(this.state.projects)
    }

    componentDidMount() {
        this.getProjects();
    }

    handleShowProjectCreation = () => {
        this.setState({
            showProjectCreateDialog: true
            })};

    handleCreateProjectButtonClicked = (event) => {
        console.log("test")
        event.stopPropagation();
        this.setState({
            showProjectDurationDialog: true
        })
    }

    projectCreateDialogClosed = project => {
        // projectWork ist nicht null und deshalb erstelltI/überarbeitet
        if (project) {
            const newProjectList = [...this.state.projects, project];
            this.setState({
                projects: newProjectList,
                showProjectCreateDialog: false
            });
        } else {
            this.setState({
                showProjectCreateDialog: false
            });
        }
    }


    handleDurationClose = () => {
        this.setState({
                showProjectDurationDialog: false
            });
    }
    /**
     * Behandelt onProjectDeleted Events der ProjectListEntry Komponente
     */
    projectDeleted = project => {
        const newProjectList = this.state.projects.filter(projectFromState => projectFromState.getID() !== project.getID());
        this.setState({
            projects: newProjectList,
            showProjectForm: false
        });
    }

    /** Behandelt das onClose Event von ProjectForm
    projectWorkClosed = projectWork => {
        // project ist nicht null und deshalb erstelltI/überarbeitet
        if (project) {
            const newProjectList = [...this.state.projects, project];
            this.setState({
                projects: newProjectList,
                showProjectForm: false
            });
        } else {
            this.setState({
                showProjectForm: false
            });
        }
    }*/


    render() {
        const {projects, showProjectCreateDialog, showProjectDurationDialog} = this.state
        //console.log(this.state)
        return (
            <div>
                <Box m={18} pl={8}>
                <Grid container direction={'row'} spacing={18}>
                    <Grid item xs={3} align={"center"}>
                        <Button variant='contained' color='primary'
                                onClick={this.handleCreateProjectButtonClicked}>
                            Projekt erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Meine Projekte: </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Klient: </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Arbeitsleistung: </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Projektlaufzeit: </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {projects.map(pro =>
                            <ProjectListEntry key={pro.getID()} project={pro} onProjectDeleted={this.projectDeleted}/>)}
                    </Grid>
                </Grid>
                <ProjectCreateDialog onClose={this.projectCreateDialogClosed} show={showProjectCreateDialog}/>
                <ProjectDurationDialog openProjectDurationDialog={this.handleShowProjectCreation} onClose={this.handleDurationClose} show={showProjectDurationDialog}/>
            </Box>
            </div>
                );
    }
}


ProjectCreateDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired
}

export default ProjectList;