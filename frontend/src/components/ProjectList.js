import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Box, Button, Divider, Grid, Typography} from '@mui/material';
import ProjectListEntry from "./ProjectListEntry";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import PropTypes from "prop-types";
import ProjectDurationDialog from "./dialogs/ProjectDurationDialog";

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
        })
    };

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

    render() {
        const {projects, showProjectCreateDialog, showProjectDurationDialog} = this.state
        //console.log(this.state)
        return (
            <div>
                <Box m={22} pl={1}>
                <Grid container mt={14}  alignItems='stretch' spacing={1}>
                    <Grid item xs={3}/>
                    <Grid item xs={5} align={"center"}>
                        <Typography variant={"h4"} algin={"center"} component={"div"}>
                            Meine Projekte:
                        </Typography>
                    </Grid>
                    <Grid item xs={4}  align={"right"}>
                        <Button variant='contained' color='primary'
                                onClick={this.handleCreateProjectButtonClicked}>
                            Projekt erstellen
                        </Button>
                    </Grid>
                </Grid>
                <Grid container mt={3}>
                    <Grid item xs={12}  align={"center"}>
                        <Grid container>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Projektname: </Typography>
                            </Grid>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Klient: </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Projektlaufzeit: </Typography>
                            </Grid>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Arbeitsleistung: </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {projects.map(pro =>
                            <ProjectListEntry key={pro.getID()} project={pro}
                                              onProjectDeleted={this.projectDeleted}/>)}
                    </Grid>
                </Grid>
                <ProjectCreateDialog onClose={this.projectCreateDialogClosed} show={showProjectCreateDialog}/>
                <ProjectDurationDialog openProjectDurationDialog={this.handleShowProjectCreation}
                                       onClose={this.handleDurationClose} show={showProjectDurationDialog}/>
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