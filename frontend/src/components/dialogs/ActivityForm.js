import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI, ActivityBO } from "../../api";


class ActivityForm extends Component {

    constructor(props) {
        super(props);

        let an = '', cap = '', pro = 0;
        if (props.activity) {
            an = props.activity.getActivityName();
            cap = props.activity.getActivityCapacity();
            pro = 1
        }


        this.state = {
            activityName: an,
            capacity: cap,
            affiliatedProject: pro,
            activityNameValidationFailed: false,
            capacityValidationFailed: false
        };
        this.baseState = this.state;
    }

    handleClose = () => {
        // den state neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }


    textFieldValueChange = (event) => {
        const value = event.target.value;

        let error = false;
        if (value.trim().length === 0) {
            error = true;
        }

        this.setState({
            [event.target.id]: event.target.value,
            [event.target.id + 'ValidationFailed']: error,
            [event.target.id + 'Edited']: true
        });
    }


    addActivity = () => {
    let newActivity = new ActivityBO(this.state.activityName, this.state.capacity,
            this.state.affiliatedProject);
    HdMWebAppAPI.getAPI().addActivity(newActivity).then(activity => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty customer
      this.setState(this.baseState);
      this.props.onClose(activity); // call the parent with the customer object from backend
    }).catch(e =>
      console.log(e)
    );


    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }


    updateActivity = () => {
        // clone the original activity, in case the backend call fails
        let updatedActivity = Object.assign(new ActivityBO(), this.props.activity);
        // set the new attributes from our dialog
        updatedActivity.setActivityName(this.state.activityName);
        updatedActivity.setActivityCapacity(this.state.capacity);
        HdMWebAppAPI.getAPI().updateActivity(updatedActivity).then(activity => {
            // den neuen state als baseState speichern
            this.baseState.activityName = this.state.activityName;
            this.baseState.capacity = this.state.capacity;
            this.props.onClose(updatedActivity);      // call the parent with the new customer
        })
    }

    render() {
        const {activity, show} = this.props;
        const {activityName, capacity, activityNameValidationFailed, capacityValidationFailed} = this.state;

        let title = '';
        let header = '';

        if (activity) {
            // ProjectWork definiert, Bearbeitungsdialog wird angezeigt
            title = 'Aktivität bearbeiten';
            header = `Aktivität ID: ${activity.getID()}`;
        } else {
            // ProjectWork ist nicht definiert, Erstellungsdialog wird angezeigt
            title = 'Neue Aktivität erstellen';
            header = 'Geben Sie der Akivität einen Namen und eine Kapazität in Stunden';
        }

        return (
        show ?
          <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
            <DialogTitle id='form-dialog-title'>{title}
              <IconButton algin={'right'} onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {header}
              </DialogContentText>
                <form noValidate autoComplete='off'>
                <TextField autoFocus type='text' required fullWidth margin='normal' id='activityName' label='Name:' value={activityName}
                  onChange={this.textFieldValueChange} error={activityNameValidationFailed}
                  helperText={activityNameValidationFailed ? 'Bitte geben Sie einen Namen an' : ' '} />
                <TextField type='text' required fullWidth margin='normal' id='capacity' label='Kapazität:' value={capacity}
                  onChange={this.textFieldValueChange} error={capacityValidationFailed}
                  helperText={capacityValidationFailed ? 'Bitte geben Sie eine Kapazität in Stunden an' : ' '} />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
              {// Falls eine Aktivität gegeben ist, sichern Knopf anzeigen, sonst einen Erstellen Knopf
                activity ?
                  <Button color='primary' onClick={this.updateActivity}>
                    Sichern
                  </Button>
                  : <Button color='primary' onClick={this.addActivity}>
                    Erstellen
                  </Button>
              }
            </DialogActions>
          </Dialog>
            : null
    );

    }
}

/** PropTypes */
ActivityForm.propTypes = {

  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

export default ActivityForm;