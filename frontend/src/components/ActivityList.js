import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider, Box} from '@mui/material';
import ListItem from "@mui/material/ListItem";
import ActivityForm from "./dialogs/ActivityForm";
import PropTypes from "prop-types";
import ActivityListEntry from "./ActivityListEntry";
import Card from "@mui/material/Card";
import ActivityDeleteDialog from "./dialogs/ActivityDeleteDialog";



class ActivityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            showActivityForm: false
        };
    };

    componentDidMount() {
        HdMWebAppAPI.getAPI().getActivities()
            .then(activitiesBOs =>
                this.setState({
                    activities: activitiesBOs
                })).catch(e =>
            this.setState({
                activities: []
            }));
    }

    addActivity = () => {
    HdMWebAppAPI.getAPI().addActivityForProject(this.props.project.getID()).then(activitiesBO => {

      this.setState({  // Set new state when AccountBOs have been fetched
        activities: [...this.state.activities, activitiesBO],
        loadingInProgress: false, // loading indicator
        addingActivityError: null
      })
    }).catch(e =>
      this.setState({ // Reset state with error from catch
        activities: [],
        loadingInProgress: false,
        addingActivityError: e
      })
    );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      addingActivityError: null
    });
    }

    activityDeleted = activity => {
    const newActivityList = this.state.activities.filter(activityFromState => activityFromState.getID() !== activities.getID());
    this.setState({
      activities: newActivityList,
      showActivityForm: false
    });
    }

  /** Behandelt das onClose Event von CustomerForm */
  ActivityClosed = activity => {
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
        const { classes } = this.props;
        const { activities, showActivityForm } = this.state;

        return (
            <Box sx={{m: 2}}>
                <Card>
                    <Grid container spacing={1} justifyContent={"center"}>
                        <Grid container>
                            <Typography variant={"h3"} component={"div"}>
                                Projekt:
                            </Typography>
                                <Button variant={"contained"} color='primary'>
                                    Projekt bearbeiten
                                </Button>
                        </Grid>
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
                        {activities.map(a =>
                            <ActivityListEntry key={a.getID()} activity={a} onActivityDeleted={this.activityDeleted}/>)
                        }
                        <Grid item xs={12} align={"center"}>
                            {this.state.activities.map((activity) => (
                                <Box key={activity}>
                                        <Grid container justifyContent={"left"}>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.capacity}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.work_time}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.affiliated_project}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                        <Grid container>
                            <Button variant={"contained"} color='primary'>
                                Aktivität anlegen
                            </Button>
                        </Grid>
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                        <ActivityForm onClose={this.activityFormClosed} show={showActivityForm}></ActivityForm>
                </Card>
            </Box>
        )
    }

}

ActivityList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO of this AccountList */
  project: PropTypes.object.isRequired,
  /** If true, accounts are (re)loaded */
  show: PropTypes.bool.isRequired
}

export default ActivityList;