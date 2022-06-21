import React, {Component} from 'react';
import {ActivityBO, HdMWebAppAPI} from "../api";
import {withStyles, Button, Grid, Typography, Divider} from '@mui/material';
import {Card, Box} from "@mui/material";
import AddIcon from '@material-ui/icons/Add';
import ActivityForm from "./dialogs/ActivityForm";
import PropTypes from "prop-types";
import ActivityListEntry from "./ActivityListEntry";
import ProjectMemberList from "./ProjectMemberList";
import {spacing} from '@mui/system'
import ProjectMemberListEntry from "./ProjectMemberListEntry";


class ActivityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            showActivityForm: false
        };
    };

    getActivitiesForProject() {
        HdMWebAppAPI.getAPI().getActivities(1)
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

    handleAddActivityButtonClicked = (event) => {
        // Dialog öffnen, um damit eine Aktivität anlegen zu können
        event.stopPropagation();
        this.setState({
            showActivityForm: true
        })
    }

    activityDeleted = activity => {
        const newActivityList = this.state.activities.filter(activityFromState => activityFromState.getID() !== activity.getID());
        this.setState({
            activities: newActivityList,
            showActivityForm: false
        });
    }

    /** Behandelt das onClose Event von CustomerForm */
    activityFormClosed = activity => {
        // projectWork ist nicht null und deshalb erstelltI/überarbeitet
        if (activity) {
            const newActivityList = [...this.state.activities, activity];
            this.setState({
                activities: newActivityList,
                showActivityForm: false
            });
        } else {
            this.setState({
                showActivityForm: false
            });
        }
    }

    render() {
        const {classes} = this.props;
        const {activities, showActivityForm} = this.state;

        return (
            <div>
                <Box m={25}>
                    <Card>
                        <Grid container spacing={1} justifyContent={"center"}>
                            <Grid item xs={12}>
                                <Typography variant={"h4"} algin={"left"} component={"div"}>
                                    Projekt: {this.props.projectName}
                                </Typography>
                                <Button variant='contained' color='primary' startIcon={<AddIcon/>} algin={"center"}
                                        onClick={this.handleAddActivityButtonClicked}>
                                    Aktivität anlegen
                                </Button>
                            </Grid>
                            <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item xs={12} align={"center"}>
                                    <Grid container>
                                        <Grid item xs={3} align={"flex-end"}>
                                            <Typography variant={"h5"} component={"div"}> Aktivitäten </Typography>
                                        </Grid>
                                        <Grid item xs={3} align={"flex-end"}>
                                            <Typography variant={"h5"} component={"div"}> Kapazität </Typography>
                                        </Grid>
                                        <Grid item xs={3} align={"flex-end"}>
                                            <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider/>
                                    {activities.map(ac => <ActivityListEntry key={ac.getID()} activity={ac}
                                                                             onActivityDeleted={this.activityDeleted}/>)
                                    }
                                </Grid>
                            </Grid>
                            <ActivityForm onClose={this.activityFormClosed} show={showActivityForm}></ActivityForm>

                        </Grid>
                    </Card>
                </Box>
                    <ProjectMemberList> show={ProjectMemberList} </ProjectMemberList>
            </div>
        )
    }
}


ActivityList.propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** The CustomerBO of this AccountList */
    project: PropTypes.object.isRequired,
    /** If true, accounts are (re)loaded */
    show: PropTypes.bool.isRequired,
}


ActivityForm.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default ActivityList;