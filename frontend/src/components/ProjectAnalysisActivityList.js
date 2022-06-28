import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import {Typography} from '@material-ui/core';
import {Grid} from '@mui/material';
import ProjectAnalysisActivityListEntry from "./ProjectAnalysisActivityListEntry";


class ProjectAnalysisActivityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            showActivityForm: false
        };
    };

    getActivitiesForProject() {
        HdMWebAppAPI.getAPI().getActivities(this.props.project.getID())
            .then(activityBOs =>
                this.setState({
                    activities: activityBOs
                })).catch(e =>
            this.setState({
                activities: []
            }));
    }

    componentDidMount() {
        this.getActivitiesForProject();
    }

    render() {
        const {activities} = this.state;

        return (
            <div style={{width: "100%", p: 0, m: 0}}>
                <Grid container spacing={2}>
                    <Grid item xs={4} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Aktivitätsname </Typography>
                    </Grid>
                    <Grid item xs={4} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Soll </Typography>
                    </Grid>
                    <Grid item xs={4} align={"center"}>
                        <Typography variant={"h2"} component={"div"}> Ist </Typography>
                    </Grid>
                </Grid>
                {activities.map(ac =>
                    <ProjectAnalysisActivityListEntry key={ac.getID()} activity={ac} startDate={this.props.startDate}
                                                      endDate={this.props.endDate}/>)
                }
            </div>
        )
    }
}


export default ProjectAnalysisActivityList;