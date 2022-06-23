import React, {Component} from 'react';
import {ActivityBO, HdMWebAppAPI} from "../api";
import {Button, Grid, Typography, Divider, Box,} from '@mui/material';
import ActivityListEntry from "./ActivityListEntry";
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
            <div style={ {width: "100%", p: 0, m:0}}>
                    <Grid container>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}> Aktivitsname </Typography>
                        </Grid>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}> Soll </Typography>
                        </Grid>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}> Ist </Typography>
                        </Grid>
                    </Grid>
                    {activities.map(ac =>
                        <ProjectAnalysisActivityListEntry key={ac.getID()} activity={ac} />)
                    }
            </div>
        )
    }
}


export default ProjectAnalysisActivityList;