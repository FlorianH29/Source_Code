import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider} from '@mui/material';
import ProjectListEntry from "./ProjectListEntry";
import ProjectCreateDialog from "./dialogs/ProjectCreateDialog";
import PropTypes from "prop-types";


class ProjectList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            showProjectCreateDialog: false
        }
    }

    componentDidMount() {
        this.getProjects();
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

    handleCreateProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectCreateDialog: true
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


    render() {
        const {projects, showProjectCreateDialog} = this.state
        console.log(this.state)
        return (<div>
            <Grid container>
                <Grid item xs={12} align={"center"}>
                    <Grid container>
                        <Grid item xs={3} align={"flex-end"}>
                            <Typography variant={"h5"} component={"div"}> Meine Projekte: </Typography>
                        </Grid>
                        <Grid item xs={3} align={"flex-end"}>
                            <Typography variant={"h5"} component={"div"}> Klient: </Typography>
                        </Grid>
                    </Grid>
                    <Divider/>
                    {projects.map(pro => <ProjectListEntry key={pro.getID()} project={pro}/>)}
                    <Grid container direction={'row'} spacing={18}>
                        <Grid item xs={20} align={""}>
                            <Button variant='contained' color='primary'
                                    onClick={this.handleCreateProjectButtonClicked}>
                                Projekt erstellen
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ProjectCreateDialog onClose={this.projectCreateDialogClosed} show={showProjectCreateDialog}/>
        </div>);
    }
}


ProjectCreateDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default ProjectList;