import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI} from '../../api';
import {DatePicker, DateTimePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

/**
 * Shows a modal form dialog for a CustomerBO in prop customer. If the customer is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given CustomerBO object.
 * If the customer is null, the dialog is configured as a new customer dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a customer.
 * After that, the function of the onClose prop is called with the created/update CustomerBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 */
class EventAndTimeIntervalForm extends Component {

    constructor(props) {
        super(props);
        let name = null;
        let projectworkid = null;
        let startdate = null;
        let starteventid = null;
        let enddate = null;
        let endeventid = null;
        if (props.event) {
            name = props.event.name;
            projectworkid = props.event.projectworkid;
            startdate = props.event.start_time;
            starteventid = props.event.starteventid;
            enddate = props.event.endtime;
            endeventid = props.event.endeventid;
        }
        // Den State initiieren
        this.state = {
            projectWorkName: name,
            projectWorkID: projectworkid,
            startDate: startdate,
            starteventid: starteventid,
            endDate: enddate,
            endeventid: endeventid,
            projectWorkNameValidationFailed: false,
            startDateValidationFailed: false,
            endDateValidationFailed: false,
            startDateChanged: false,
            endDateChanged: false
        };
        // den state speichern, für den Fall, dass abgebrochen wird
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

    /** Überschreibt das ProjectWorkBO mit neuen Werten */
    handleUpdateClick = () => {
        if (this.state.projectWorkID != null) {
            HdMWebAppAPI.getAPI().updateProjectWorkNameByID(this.state.projectWorkID, this.state.projectWorkName).then(projectWork => {
                // den neuen state als baseState speichern
                this.baseState.projectWorkName = this.state.projectWorkName;
                let event = this.props.event;
                event.name = this.state.projectWorkName;
                this.props.onClose(event);
            })
        }
        if (this.state.startDateChanged) {
            HdMWebAppAPI.getAPI().updateEventByID(this.state.starteventid, this.state.startDate).then(event => {
                this.baseState.startDate = this.state.startDate;
                let events = this.props.event;
                events.starttime = this.state.startDate;
                this.props.onClose(events);
            })
        }
        if (this.state.endDateChanged) {
            HdMWebAppAPI.getAPI().updateEventByID(this.state.endeventid, this.state.endDate).then(event => {
                this.baseState.endDate = this.state.endDate;
                let events = this.props.event;
                events.endtime = this.state.endDate;
                this.props.onClose(events);
            })
        }
    }

    /** Renders the component */
    render() {
        const {show} = this.props;
        const { projectWorkName, projectWorkID, projectWorkNameValidationFailed, startDateValidationFailed,
            endDateValidationFailed, startDateChanged, endDateChanged} = this.state;

        let title = 'Projectarbeit bearbeiten';
        let header = '';

        return (
            show ?
                <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
                    <DialogTitle id='form-dialog-title'>{title}
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>
                        <form noValidate autoComplete='off'>
                            {
                                this.props.event.name != 'Kommen' && this.props.event.name != 'Gehen' &&
                                this.props.event.name != 'break' && this.props.event.name != 'Arbeitszeit' ?
                                    <TextField autoFocus type='text' required fullWidth margin='normal'
                                               id='projectWorkName'
                                               label='Name:' value={projectWorkName}
                                               onChange={this.textFieldValueChange}
                                               error={projectWorkNameValidationFailed}
                                               helperText={projectWorkNameValidationFailed ? 'Bitte geben Sie einen Namen an' : ' '}/>
                                    : ''
                            }
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label={"Start wählen"}
                                    value={this.state.startDate}
                                    onChange={(date) => {
                                        this.setState({startDate: date.getTime(), startDateChanged: true});
                                    }}
                                    renderInput={(params) => <TextField{...params}/>}
                                />

                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label={"Ende wählen"}
                                    value={this.state.endDate}
                                    onChange={(date) => {
                                        this.setState({endDate: date.getTime(), endDateChanged: true});
                                    }}
                                    renderInput={(params) => <TextField{...params}/>}
                                />

                            </LocalizationProvider>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        {// Falls eine Projektarbeit gegeben ist, sichern Knopf anzeigen, sonst einen Erstellen Knopf
                            <Button color='primary' onClick={this.handleUpdateClick}>
                                Sichern
                            </Button>

                        }
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

export default EventAndTimeIntervalForm;