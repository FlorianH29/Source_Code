import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {ActivityBO, HdMWebAppAPI} from "../../api";

/**
 * Zeigt einen Dialog, der wenn es eine Aktivität gibt, das editieren dieser Aktivität ermöglicht
 * und wenn eien Aktivität angelegt werden soll dies ermöglicht, dann sind die Textfelder leer.
 * Es werden im Backend die Methoden update und add aufgerufen.
 * Danach wird die OnClose prop Funktion mit dem neuen oder editiertem ActivityBO als
 * Parameter aufgerufen. Wenn der Dialog ohne Eingabe beendet wird, wird die OnClose mit null aufgerufen.
 */

class ActivityForm extends Component {

    constructor(props) {
        super(props);

        let an = '', cap = '';
        if (props.activity) {
            an = props.activity.getActivityName();
            cap = props.activity.getActivityCapacity();
        }

        let pro = 0;
        if (props.project) {
            pro = props.project.getID();
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

    /** Behandelt das click event für den Button Abbrechen*/
    handleClose = () => {
        // den state neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    /** Behandelt Wertänderungen der Textfelder und validiert diese */
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
    console.log(newActivity);
    HdMWebAppAPI.getAPI().addActivity(newActivity).then(activity => {
      // Backend call erfolgreich
      this.setState(this.baseState);
      this.props.onClose(activity); // call the parent with the customer object from backend
    }).catch(e =>
      console.log(e)
    );
    }

    /** Überschreibt das ActivityBO mit neuen Werten */
    updateActivity = () => {
        // die originale Activity klonen, für den Fall, dass der Backend Call fehlschlägt
        let updatedActivity = Object.assign(new ActivityBO(), this.props.activity);
        // setzen der neuen Attribute aus dem Dialog
        updatedActivity.setActivityName(this.state.activityName);
        updatedActivity.setActivityCapacity(this.state.capacity);
        HdMWebAppAPI.getAPI().updateActivity(updatedActivity).then(activity => {
            // den neuen state als baseState speichern
            this.baseState.activityName = this.state.activityName;
            this.baseState.capacity = this.state.capacity;
            this.props.onClose(updatedActivity);      // call the parent with the new customer
        })
    }

    /** Rendert die Komponente */
    render() {
        const {activity, show} = this.props;
        const {activityName, capacity, activityNameValidationFailed, capacityValidationFailed} = this.state;

        let title = '';
        let header = '';

        if (activity) {
            // Activity definiert -> Bearbeitungsdialog wird angezeigt
            title = 'Aktivität bearbeiten';
            header = `Aktivität ID: \x22${activity.getID()}\x22`;
        } else {
            // Activity ist nicht definiert -> Erstellungsdialog wird angezeigt
            title = 'Neue Aktivität erstellen';
            header = 'Geben Sie der Akivität einen Namen und eine Kapazität in Stunden';
        }

        return (
            show ?
                <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
                    <DialogTitle id='form-dialog-title'>{title}
                        <IconButton algin={'right'} onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>
                        <form noValidate autoComplete='off'>
                            <TextField autoFocus type='text' required fullWidth margin='normal' id='activityName'
                                       label='Name:' value={activityName}
                                       onChange={this.textFieldValueChange} error={activityNameValidationFailed}
                                       helperText={activityNameValidationFailed ? 'Bitte geben Sie einen Namen an' : ' '}/>
                            <TextField type='text' required fullWidth margin='normal' id='capacity' label='Kapazität:'
                                       value={capacity}
                                       onChange={this.textFieldValueChange} error={capacityValidationFailed}
                                       helperText={capacityValidationFailed ? 'Bitte geben Sie eine Kapazität in Stunden an' : ' '}/>
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