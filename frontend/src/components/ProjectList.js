import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from '@mui/material';

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
        return (
            <div>
                <Grid container spacing={1} justify='flex-start' alignItems='center'>
                    <Grid item>
                        <Typography>
                            Filter projects by name/person:
                        </Typography>
                    </Grid>
                </Grid>
                {

                }
            </div>
        );

    }

}

export default ProjectList;