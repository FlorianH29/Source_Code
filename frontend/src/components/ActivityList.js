import React, {Component} from 'react';
import {ActivityBO, HdMWebAppAPI} from "../api";
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider, Box} from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import ActivityForm from "./dialogs/ActivityForm";
import PropTypes from "prop-types";
import ActivityListEntry from "./pages/ActivityListEntry";
import Card from "@mui/material/Card";



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

    updateActivity = () => {
        // das originale Activity klonen, für den Fall, dass Backend Call fehlschlägt
        let updatedActivity = Object.assign(new ActivityBO, this.props.activity);
        // setzen der neuen Attribute aus dem Dialog
        updatedActivity.setActivityName(this.state.activityName);
        updatedActivity.setActivityCapacity(this.state.capacity);
        HdMWebAppAPI.getAPI().updateActivity(updatedActivity).then(activity => {
            // den neuen state als baseState speichern
            this.baseState.activityName = this.state.activityName;
            this.baseState.capacity = this.state.capacity;
            this.props.onClose(updatedActivity);
        })
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
                        {activities.map(ac =>
                            <ActivityListEntry key={ac.getID()} activity={ac} onActivityDeleted={this.activityDeleted}/>)
                        }
                        <Grid item xs={12} align={"center"}>
                            <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={this.handleAddActivityButtonClicked}>
                                Aktivität anlegen
                            </Button>
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