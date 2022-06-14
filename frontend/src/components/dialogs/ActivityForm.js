import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI, ActivityBO } from "../../api";


class ActivityForm extends Component {

    constructor(props) {
        super(props);

        let an = '', cap = '';
        if (props.activity) {
            an = props.activity.getActivityName();
            cap = props.activity.getActivityCapacity();
        }


        this.state = {
            activityName: an,
            capacity: cap,
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
    HdMWebAppAPI.getAPI().addActivityForProject(this.props.project.getID()).then(activitiesBO => {

      this.setState({  // Set new state when AccountBOs have been fetched
        activities: [...this.state.activities, activitiesBO],
        loadingInProgress: false, // loading indicator
        addingActivityError: null,
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
            header = 'Geben Sie die Kapazität in Stunden an';
        }

        return (
        show ?
          <Dialog open={true} onClose={this.handleClose} maxWidth='xs'>
            <DialogTitle id='form-dialog-title'>{title}
              <IconButton onClick={this.handleClose}>
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
                  <Button color='primary' onClick={this.addActivity}>
                    Sichern
                  </Button>
                  : <Button color='primary'>
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