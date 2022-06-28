import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Box, Button, Divider, Typography, Card} from '@material-ui/core';
import {Grid} from '@mui/material';
import ProjectListEntry from "./ProjectListEntry";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import ProjectDurationDialog from "./dialogs/ProjectDurationDialog";
import AddIcon from "@material-ui/icons/Add";
import {withStyles} from "@mui/styles";


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

        return (
            <div>
                <Box mt={18} ml={21} mr={2} mb={10} pl={8}>
                    <Card>
                        <Grid container p={1} alignItems='stretch' spacing={1}>

                            <Grid item xs={9} align={"center"}>
                                <Typography variant={"h1"} algin={"center"} component={"div"}>
                                    Meine Projekte
                                </Typography>
                            </Grid>
                            <Grid item xs={3} align={"right"}>
                                <Button variant='contained' color='primary' startIcon={<AddIcon/>}
                                        onClick={this.handleCreateProjectButtonClicked}>
                                    Projekt erstellen
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container mt={3}>
                            <Grid item xs={12} align={"center"}>
                                <Grid container>
                                    <Grid item xs={2} align={"flex-end"}>
                                        <Typography variant={"h2"} component={"div"}> Projektname </Typography>
                                    </Grid>
                                    <Grid item xs={2} align={"flex-end"}>
                                        <Typography variant={"h2"} component={"div"}> Auftraggeber </Typography>
                                    </Grid>
                                    <Grid item xs={4} align={"flex-end"}>
                                        <Typography variant={"h2"} component={"div"}> Projektlaufzeit </Typography>
                                    </Grid>
                                    <Grid item xs={2} align={"flex-end"}>
                                        <Typography variant={"h2"} component={"div"}> Arbeitsleistung </Typography>
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
                    </Card>
                </Box>
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


export default withStyles(styles)(ProjectList);