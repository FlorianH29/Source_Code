import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ActivityDeleteDialog from "./dialogs/ActivityForm";
import ActivityForm from "./dialogs/ActivityForm";
import {HdMWebAppAPI} from "../api";
import {Link as RouterLink, withRouter} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";


class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity : props.activity,
            showActivityForm: false,
            showActivityDeleteDialog: false,
        };
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
    const { project, person } = this.props;
    const { activity, showActivityForm, showActivityDeleteDialog } = this.state;

      return (
        <div>
           <ListItem>
             <Grid container alignItems='center'>
                 <ListItemButton component={RouterLink} to={{
                pathname: `/projectworks`,
                owner: {
                     activity: activity,
                     project: project
                    },
                 per: {
                    person: person
                 }
                    }}>
               <Grid item xs={3} align={"center"}>
                 <Typography variant={"h5"} component={"div"}>
                     {activity.getActivityName()}
                 </Typography>
               </Grid>
              </ListItemButton>
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
                 { person.getID() === project.owner ? (
                  <Grid item xs={3} align={"center"}>
                    <Button color='primary' size='small' startIcon={<EditIcon />} onClick={this.editActivityButtonClicked}> </Button>
                    <Button color='secondary' size='small' startIcon={<RemoveCircleOutlineRoundedIcon />} onClick={this.deleteActivityButtonClicked}> </Button>
                  </Grid>
                     ):
                 <Grid item xs={3} align={"center"}>
                </Grid>}
             </Grid>
           </ListItem>
           <Divider/>
          <ActivityDeleteDialog show={showActivityDeleteDialog} activity={activity} onClose={this.deleteActivityDialogClosed} />
          <ActivityForm show={showActivityForm} activity={activity} onClose={this.activityFormClosed} />
        </div>
      );
    }
}

const styles = theme => ({
  root: {
    width: '100%',
  },
});

ActivityListEntry.propTypes = {
  /** Das ActivityBO welches gerendert werden soll */
  classes: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  onActivityDeleted: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default withRouter(ActivityListEntry);
