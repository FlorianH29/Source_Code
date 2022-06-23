import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI, ProjectBO} from "../../api";
import {
    Divider,
    Grid,
    Typography,
    TextField,
    Dialog,
    Button,
    DialogTitle,
    IconButton,
    DialogContent, DialogActions
} from "@mui/material";
import ProjectWorkListEntry from "../ProjectWorkListEntry";
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ProjectCreateDialog from "./ProjectCreateDialog";
import CloseIcon from "@material-ui/icons/Close";
import {DialogContentText} from "@material-ui/core";
import PropTypes from "prop-types";

class ProjectDurationDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date().getTime(),
            endDate: new Date().getTime(),
            eventType: 0,
            showProjectDurationForm: false,
            disableStartButton: false,
            disableEndButton: true,
            showProjectCreateDialog: false
        }

    }

    /** Erzeugt ein Projekt-Laufzeit-Start als EventBO  */
    addProjectDurationStartEvent = () => {
        let newEventBO = new EventBO(this.state.startDate, this.state.eventType);
        HdMWebAppAPI.getAPI().addProjectDurationStartEvent(newEventBO).then(projectStart => {
        this.setState(this.baseState);
        //this.props.onClose(projectStart);
    }).catch (e =>
        console.log(e));
    }

    /** Erzeugt ein Projekt-Laufzeit-Ende als EventBO  */
    addProjectDurationEndEvent = () => {
        let newEventBO = new EventBO(this.state.endDate, this.state.eventType);
        HdMWebAppAPI.getAPI().addProjectDurationEndEvent(newEventBO).then(projectStart => {
            //this.props.onClose(projectStart);
    }).catch (e =>
        console.log(e));
    }

    /** Erzeugt ein TimeInterval mit den Start- und Endevents der Projektlaufzeit
    addProjectDuration = () => {
        HdMWebAppAPI.getAPI().addProjectDuration
    }*/


    /** Disabled den "Projektstart anlegen" Button, sobald ein ProjektStart ausgewählt wurde und
     * der Button geclickt wird und ruft die Methode addProjectDurationStart auf
     */
    disableStartHandler = () => {
        this.setState({
                disableStartButton: true,
                disableEndButton: false
            });
        this.addProjectDurationStartEvent()
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



   /** getEventForTimeIntervalTransactions = (startDate, endDate) => {
        HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions(startDate, endDate)
            .then(eventAndTransaction =>
                this.setState({
                    events: eventAndTransaction
                })
            ).catch(eventAndTransaction =>
            this.setState({
                events: []
            }));
    }*/

    componentDidMount() {
        //this.addProjectDurationStart(this.state.startDate, this.state.eventType)
    }


  /** Behandelt das onClose Event */
  /**
  eventAndTimeIntervalFormClosed = eventAndTimeInterval => {
    if (eventAndTimeInterval) {
      const newEventAndTimeIntervalList = [...this.state.events, eventAndTimeInterval];
      this.setState({
        events: newEventAndTimeIntervalList,
        showEventAndTimeIntervalForm: false
      });
    } else {
        this.setState({
          showEventAndTimeIntervalForm: false
        });
      }
  }*/

    render() {
        const {startDate, endDate, eventType, disableStartButton, disableEndButton, handleMoveOnButtonClicked, handleFinishedButtonClicked} = this.state;
        const {showProjectDurationForm, getEventForTimeIntervalTransactions, show, showProjectCreateDialog} = this.props

        let header = '';
        let title = '';

        if (disableStartButton === false ) {
            /** Beim öffnen des Dialogs, weist der Titel auf den Projektstart hin */
            title = 'Wann soll das Projekt beginnen?'
            header = 'Wähle  ein Start-Datum aus und klicke auf "Weiter"...'
        } else {
            /** Beim öffnen des Dialogs, weist der Titel auf den Projektstart hin */
            title = 'Wann soll das Projekt enden?'
            header = 'Wähle ein End-Datum aus und klicke auf "Fertig"... '
        }

        //console.log(endDate)
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
                    <LocalizationProvider  dateAdapter={AdapterDateFns}>
                        <DatePicker
                            disabled={disableStartButton}
                            label={"Start Date"}
                            value={startDate}
                            onChange={(date) => {
                                this.setState({ eventType: 7, startDate: date.getTime()});
                                //this.addProjectDurationStartEvent()
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            disabled={disableEndButton}
                            label={"End Date"}
                            value={endDate}
                            onChange={(date) => {
                                this.setState({ eventType: 8, endDate: date.getTime()});
                                //console.log(date.getTime())
                                //this.addProjectDurationEndEvent()
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        </LocalizationProvider>

                        </div>
                       </DialogContent>
                       <DialogActions>
                           <Button onClick={this.handleClose} color='secondary'>
                          Abbrechen
                      </Button>
                    <Button color={"primary"} disabled={disableStartButton} onClick={this.disableStartHandler}>
                                  Weiter
                              </Button>
                    <div/>
                    <Button color={"primary"} disabled={disableEndButton} onClick={this.handleFinishedButtonClicked}>
                                  Fertig
                              </Button>
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