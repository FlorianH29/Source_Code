import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider} from '@mui/material';
import ProjectListEntry from "./ProjectListEntry";
import PropTypes from "prop-types";

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

    render() {
        const {projects} = this.state
        console.log(this.state)
        return (
            <div>
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
                    {projects.map(pro =>
                        <ProjectListEntry key={pro.getID()} project={pro}/>)
                    }
                    </Grid>
                </Grid>
                {

                }
            </div>
        );

    }

}


export default ProjectList;