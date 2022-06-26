import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ActivityDeleteDialog from "./dialogs/ActivityDeleteDialog";
import ActivityForm from "./dialogs/ActivityForm";
import {HdMWebAppAPI} from "../api";
import {Link as RouterLink, withRouter} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";

/**
 * Rendert ein ActivityBO innerhalb eines auf- und zuklappbaren ActivityListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes ActivityBO manipuliert werden kann.
 */

class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            activity : props.activity,
            showActivityForm: false,
            showActivityDeleteDialog: false,
        };
    }

    /** Behandelt das onClick Event des Activity bearbeiten Buttons */
    editActivityButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showActivityForm: true
    });
    }

      /** Behandelt das onClose Event von ActivityForm */
     activityFormClosed = (activity) => {
    // activity ist nicht null und wurde dementsprechend geändert
    if (activity) {
      this.setState({
        activity: activity,
        showActivityForm: false
      });
    } else {
      this.setState({
        showActivityForm: false
      });
    }
    }

    /** Behandelt das onClose Event von ActivityDeleteDialog*/
    deleteActivityDialogClosed = (activity) => {
    if (activity) {
      this.props.onActivityDeleted(activity);
    }
    this.setState({
      showActivityDeleteDialog: false // Den Dialog nicht mehr anzeigen
    });
    }

    /** Behandelt das onClick Event des Activity löschen Buttons */
    deleteActivityButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showActivityDeleteDialog: true
    });
    }

    /** Rendert die Componente*/
    render() {
    const { project } = this.props;
    const { activity, showActivityForm, showActivityDeleteDialog } = this.state;

      // console.log(this.state);
      return (
        <div>
           <ListItem>
             <Grid container alignItems='center'>
                 <ListItemButton component={RouterLink} to={{
                pathname: `/projectworks`,
                owner: {
                     activity: activity,
                     project: project
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

const styles = theme => ({
  root: {
    width: '100%',
  },
});

ActivityListEntry.propTypes = {
  /** Das ActivityBO welches gerendert werden soll */
  classes: PropTypes.object.isRequired,
  /** Das ActivityBO welches gerendert werden soll */
  activity: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  /** Event Handler Funktion, welche aufgerufen wird, nachdem eine Projektarbeit erfolgreich gelöscht wurde. */
  onActivityDeleted: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default withRouter(ActivityListEntry);
