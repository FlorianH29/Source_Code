import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from "../../api";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField
} from '@material-ui/core';
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ProjectCreateDialog from "./ProjectCreateDialog";
import CloseIcon from "@material-ui/icons/Close";
import {DialogContentText} from "@material-ui/core";
import PropTypes from "prop-types";

class ProjectDurationDialog extends Component {

    constructor(props) {
        super(props);

        let stE = '', eE = '';
        if (props.startDate) {
            stE = props.startDate.getTimeStamp();
            eE = props.endDate.getTimeStamp();
        } else {
            stE = new Date().getTime()
            eE = new Date().getTime()

        }

        this.state = {
            startDate: stE,//new Date().getTime(),
            endDate: eE,//new Date().getTime(),
            eventType: 7,
            showProjectDurationForm: false,
            disableStartButton: false,
            disableEndButton: true,
            showProjectCreateDialog: false
        };
        this.baseState = this.state;
    }

    /** Erzeugt ein Projekt-Laufzeit-Start als EventBO  */
    addProjectDurationStartEvent = () => {
        let newEventBO = new EventBO(this.state.startDate, this.state.eventType);
        HdMWebAppAPI.getAPI().addProjectDurationStartEvent(newEventBO).then(projectStart => {
            //this.setState(this.baseState);
            //this.props.onClose(projectStart);
        }).catch(e =>
            console.log(e));
    }

    /** Erzeugt ein Projekt-Laufzeit-Ende als EventBO  */
    addProjectDurationEndEvent = () => {
        let newEventBO = new EventBO(this.state.endDate, this.state.eventType);
        HdMWebAppAPI.getAPI().addProjectDurationEndEvent(newEventBO).then(projectEnd => {
            this.setState(this.baseState);
            //this.props.onClose(projectEnd);
        }).catch(e =>
            console.log(e));
    }


    /** Im Fall von Bearbeiten, überschreibt es den Projekt-Start mit neuen Werten */
    updateProjectDurationStartEvent = () => {
        // das originale StartEvent klonen, für den Fall, dass der Backend Call fehlschlägt.
        let updatedStartEvent = Object.assign(new EventBO(), this.props.startPoint);
        // setzen der neuen Attribute aus dem Dialog
        updatedStartEvent.setTimeStamp(this.state.startDate);
        updatedStartEvent.setEventType(7);
        HdMWebAppAPI.getAPI().updateProjectDurationStart(updatedStartEvent).then(startPoint => {
            // den neuen state als baseState speichern
            this.baseState.startDate = this.state.startDate;

            console.log(updatedStartEvent)
        })
    }

    /** Im Fall von Bearbeiten, überschreibt es das Projekt-Ende mit neuen Werten */
    updateProjectDurationEndEvent = () => {
        // das originale EndEvent klonen, für den Fall, dass der Backend Call fehlschlägt.
        let updatedEndEvent = Object.assign(new EventBO(), this.props.endPoint);
        // setzen der neuen Attribute aus dem Dialog
        updatedEndEvent.setTimeStamp(this.state.endDate);
        updatedEndEvent.setEventType(8);
        HdMWebAppAPI.getAPI().updateProjectDurationEnd(updatedEndEvent).then(project => {
            // den neuen state als baseState speichern
            this.baseState.startDate = this.state.endDate;
            this.props.onClose(updatedEndEvent);
        })
    }

    /** Disabled den "Projektstart anlegen" Button, sobald ein ProjektStart ausgewählt wurde und
     * der Button geclickt wird und ruft die Methode addProjectDurationStart auf
     */
    disableStartHandler = () => {
        this.setState({
            eventType: 7,
            disableStartButton: true,
            disableEndButton: false
        });
        this.addProjectDurationStartEvent();
    }

    disableStartHandlerForUpdate = () => {
        this.setState({
            disableStartButton: true,
            disableEndButton: false
        });
        this.updateProjectDurationStartEvent()
    }

    handleFinishedButtonClickedForUpdate = () => {
        this.setState({
            showProjectCreateDialog: true
        });
        this.updateProjectDurationEndEvent()
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    //behandelt das Click Event, dass bei "Abbrechen" ausgelöst wird
    handleClose = () => {
        // den State neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    handleFinishedButtonClicked = () => {
        this.setState({
            showProjectCreateDialog: true
        });
        this.addProjectDurationEndEvent()
        this.setState(this.baseState);
        this.props.onClose(null);
        this.props.openProjectDurationDialog();
    }

    render() {
        const {
            startDate,
            endDate,
            eventType,
            disableStartButton,
            disableEndButton,
            handleMoveOnButtonClicked,
            handleFinishedButtonClicked
        } = this.state;
        const {startPoint, endPoint, show, showProjectCreateDialog} = this.props

        let header = '';
        let title = '';

        if (disableStartButton === false) {
            /** Beim öffnen des Dialogs, weist der Titel auf den Projektstart hin */
            title = 'Wann soll das Projekt beginnen?'
            header = 'Wähle  ein Start-Datum aus und klicke auf "Weiter"...'
        } else {
            /** Beim öffnen des Dialogs, weist der Titel auf den Projektstart hin */
            title = 'Wann soll das Projekt enden?'
            header = 'Wähle ein End-Datum aus und klicke auf "Fertig"... '
        }
        const color = '#008A59'
        return (
            show ?
                <div>
                    <Dialog open={true} onClose={this.handleClose} maxWidth={"xl"}>
                        <DialogTitle id='form-dialog-title'>
                            {title}
                            <IconButton onClick={this.handleClose}>
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {header}
                            </DialogContentText>
                            <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disabled={disableStartButton}
                                        label={"Start-Datum"}
                                        value={startDate}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                            this.setState({eventType: 7, startDate: date.getTime()});
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                {" "}
                                {" "}
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disabled={disableEndButton}
                                        label={"End-Datum"}
                                        value={endDate}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                            this.setState({eventType: 8, endDate: date.getTime()});
                                        }}
                                        renderInput={(params) => <TextField {...params}/>}
                                    />
                                </LocalizationProvider>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color='secondary'>
                                Abbrechen
                            </Button>
                            {
                                startPoint ?
                                    <>
                                        <Button color={"primary"} disabled={disableStartButton}
                                                onClick={this.disableStartHandlerForUpdate}>
                                            Weiter
                                        </Button>
                                        <Button color={"primary"} disabled={disableEndButton}
                                                onClick={this.handleFinishedButtonClickedForUpdate}>
                                            Fertig
                                        </Button> </>
                                    : <><Button color={"primary"} disabled={disableStartButton}
                                                  onClick={this.disableStartHandler}>
                                            Weiter
                                         </Button>
                                        <Button color={"primary"} disabled={disableEndButton}
                                                onClick={this.handleFinishedButtonClicked}>
                                            Fertig
                                        </Button>
                                    </>
                            }
                        </DialogActions>
                    </Dialog>
                </div>
                : null
        );
    }
}

/** PropTypes*/
ProjectCreateDialog.propTypes = {

    onClose: PropTypes.func.isRequired,

    show: PropTypes.bool.isRequired,

    showProjectDurationForm: PropTypes.bool.isRequired
}

export default ProjectDurationDialog;