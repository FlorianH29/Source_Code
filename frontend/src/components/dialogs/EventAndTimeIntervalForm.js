import React, {Component} from 'react';
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
import {HdMWebAppAPI} from '../../api';
import {DateTimePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

class EventAndTimeIntervalForm extends Component {

    constructor(props) {
        super(props);
        let name = null;
        let projectworkid = null;
        let startdate = null;
        let starteventid = null;
        let enddate = null;
        let endeventid = null;
        let arriveid = null;
        let departureid = null;
        if (props.event) {
            name = props.event.name;
            projectworkid = props.event.projectworkid;
            startdate = props.event.start_time;
            starteventid = props.event.starteventid;
            enddate = props.event.endtime;
            endeventid = props.event.endeventid;
            arriveid = props.event.arriveid;
            departureid = props.event.departureid;
        }
        // Den State initiieren
        this.state = {
            projectWorkName: name,
            projectWorkID: projectworkid,
            startDate: startdate,
            starteventid: starteventid,
            arriveid: arriveid,
            departureid: departureid,
            endDate: enddate,
            endeventid: endeventid,
            projectWorkNameValidationFailed: false,
            startDateValidationFailed: false,
            endDateValidationFailed: false,
            startDateChanged: false,
            endDateChanged: false
        };
        this.baseState = this.state;
    }

    /** Behandelt das click event für den Button Abbrechen*/
    handleClose = () => {
        this.setState(this.baseState);
        this.props.onClose();
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
                this.baseState.projectWorkName = this.state.projectWorkName;
                let event = this.props.event;
                event.name = this.state.projectWorkName;
                this.props.onClose();
            })
        }
        if (this.state.startDateChanged && this.state.starteventid != null) {
            HdMWebAppAPI.getAPI().updateEventByID(this.state.starteventid, this.state.startDate).then(event => {
                this.baseState.startDate = this.state.startDate;
                let events = this.props.event;
                events.starttime = this.state.startDate;
                this.props.onClose();
            })
        }
        if (this.state.endDateChanged && this.state.endeventid != null) {
            HdMWebAppAPI.getAPI().updateEventByID(this.state.endeventid, this.state.endDate).then(event => {
                this.baseState.endDate = this.state.endDate;
                let events = this.props.event;
                events.endtime = this.state.endDate;
                this.props.onClose();
            })
        }
        if (this.state.startDateChanged && this.state.arriveid != null) {
            HdMWebAppAPI.getAPI().updateArriveByID(this.state.arriveid, this.state.startDate).then(event => {
                this.baseState.startDate = this.state.startDate;
                let events = this.props.event;
                events.starttime = this.state.startDate;
                this.props.onClose();
            })
        }
        if (this.state.endDateChanged && this.state.departureid != null) {
            HdMWebAppAPI.getAPI().updateDepartureByID(this.state.departureid, this.state.endDate).then(event => {
                this.baseState.endDate = this.state.endDate;
                let events = this.props.event;
                events.endtime = this.state.endDate;
                this.props.onClose();
            })
        }
    }

    /** Rendert die Komponente */
    render() {
        const {show} = this.props;
        const {projectWorkName, projectWorkNameValidationFailed} = this.state;

        let title = 'Projektarbeit bearbeiten';
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
                        {
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