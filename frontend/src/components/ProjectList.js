import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider} from '@mui/material';
import ProjectWorkListEntry from "./ProjectWorkListEntry";

class ProjectList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects = () => {
        HdMWebAppAPI.getAPI().getProject()
            .then(projectBOs =>
                this.setState({
                    projects: projectBOs
                })).catch(e =>
            this.setState({
                projects: []
            }));
        //console.log(this.state.projects)
    }

    render() {
        const {projects} = this.state
        return (
            <div>
                <Grid container spacing={1} justify='flex-start' alignItems='center'>
                    <Grid item>
                        <Typography>
                            Meine Projekte:
                        </Typography>
                    </Grid>
                    <Divider/>
                    {projects.map(pro =>
                    <ProjectWorkListEntry key={pro.getID()} projects ={pro}/>)
                    }
                </Grid>
                {

                }
            </div>
        );

    }

}

export default ProjectList;