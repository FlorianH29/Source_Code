import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Typography} from '@material-ui/core';
import {Grid} from '@mui/material';
import ProjectAnalysisProjectWorkListEntry from "./ProjectAnalysisProjectWorkListEntry";

class ProjectAnalysisProjectWorkList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectWorks: [],
        }
    }

    getProjectWorksForActivityBetweenTimestamps = () => {
        this.setState({projectWorks: []});
        HdMWebAppAPI.getAPI().getProjectWorksBetweenTimestamps(this.props.activity.getID(), this.props.startDate,
            this.props.endDate).then(projectWorkBOs =>
                this.setState({
                    projectWorks: projectWorkBOs
                })).catch(e =>
            this.setState({
                projectWorks: []
            }));
    }

    componentDidMount() {
        this.getProjectWorksForActivityBetweenTimestamps();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props != prevProps) {
            this.getProjectWorksForActivityBetweenTimestamps();
        }
    }

    render() {
        const {projectWorks} = this.state;
        return (
            <div style={{width: "100%", p: 0, m: 0}}>
                <Grid container spacing={2}>
                    <Grid item xs={3} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Projektarbeit </Typography>
                    </Grid>
                    <Grid item xs={3} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Bearbeiter </Typography>
                    </Grid>
                    <Grid item xs={3} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Datum </Typography>
                    </Grid>
                    <Grid item xs={3} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Dauer </Typography>
                    </Grid>
                </Grid>
                <Divider/>
                {projectWorks.map(pw =>
                    <ProjectAnalysisProjectWorkListEntry key={pw.getID()} projectWork={pw}/>)
                }
            </div>
        );
    }
}

export default ProjectAnalysisProjectWorkList;