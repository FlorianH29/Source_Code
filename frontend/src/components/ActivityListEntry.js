import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ActivityDeleteDialog from "./dialogs/ActivityForm";
import ActivityForm from "./dialogs/ActivityForm";
import {HdMWebAppAPI} from "../api";
import {Link as RouterLink, withRouter} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ProjectWorkList from "./ProjectWorkList";
import {Link} from "@mui/material";



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
    const { classes } = this.props;
    const { activity, showActivityForm, showActivityDeleteDialog } = this.state;

      // console.log(this.state);
      return (
        <div>
           <ListItem>
           <ListItemButton component={RouterLink} to={{
                    pathname: `/projectworks`,
                    ac: {
                     activity: activity
                 }}
                 }>
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
                   <Button color='primary' size='small' startIcon={<EditIcon />} onClick={this.editActivityButtonClicked}> </Button>
                   <Button color='secondary' size='small' startIcon={<DeleteIcon />} onClick={this.deleteActivityButtonClicked}> </Button>
               </Grid>
             </Grid>
             </ListItemButton>
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
