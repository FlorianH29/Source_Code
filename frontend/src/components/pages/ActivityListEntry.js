import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ActivityDeleteDialog from "../dialogs/ActivityForm";
import ActivityForm from "../dialogs/ActivityForm";
import {HdMWebAppAPI} from "../../api";



class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity : props.activity,
            showActivityForm: false,
            showActivityDeleteDialog: false,
        };
    }

    componentDidMount() {
    // load initial balance
    this.getActivityWorkTime();
    }

    /** Lifecycle method, which is called when the component was updated */
    componentDidUpdate(prevProps) {
        if ((this.props.show) && (this.props.show !== prevProps.show)) {
            this.getActivityWorkTime();
        }
    }

    // Die Dauer für eine Aktivität bekommen
    getActivityWorkTime = () => {
    HdMWebAppAPI.getAPI().getActivityWorkTime(this.props.activity.getID()).then(period =>
      this.setState({
        period: period,
        loadingInProgress: false, // loading indicator
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          period: null,
          loadingInProgress: false,
          loadingError: e
        })
      );

    // set loading to true
    this.setState({
      balance: 'loading',
      loadingInProgress: true,
      loadingError: null
    });
    }

    editActivityButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showActivityForm: true
    });
    }

     activityFormClosed = (activity) => {
    // activity ist nicht null und wurde dementsprechend geändert
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

    deleteActivityDialogClosed = (activity) => {
    if (activity) {
      this.props.onActivityDeleted(activity);
    }
    this.setState({
      showActivityDeleteDialog: false // Den Dialog nicht mehr anzeigen
    });
    }

    deleteActivityButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showActivityDeleteDialog: true
    });
    }


    render() {
    const { classes } = this.props;
    const { activity, showActivityForm, showActivityDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <ListItem>
          <Grid container alignItems='center'>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {activity.getActivityName()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {activity.getActivityCapacity()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {activity.getActivityWorkTime()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {activity.getAffiliatedProject()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
                <Button color='primary' size='small' startIcon={<EditIcon />} onClick={this.editActivityButtonClicked}> </Button>
                <Button color='secondary' size='small' startIcon={<DeleteIcon />} onClick={this.deleteActivityButtonClicked}> </Button>
            </Grid>
          </Grid>
          </ListItem>
          <Divider/>
        <ActivityDeleteDialog show={showActivityDeleteDialog} activity={activity} onClose={this.deleteActivityDialogClosed} />
        <ActivityForm show={showActivityForm} activity={activity} onClose={this.activityFormClosed} />
        </div>
    );
  }
}

ActivityListEntry.propTypes = {
  /** Das ActivityBO welches gerendert werden soll */
  classes: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  onActivityDeleted: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default ActivityListEntry;
