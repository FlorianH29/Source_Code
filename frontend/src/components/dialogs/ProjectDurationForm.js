import {HdMWebAppAPI} from '../../api';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {DialogContentText, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import ProjectCreateDialog from "./ProjectCreateDialog";


class ProjectDurationForm extends Component {

    constructor(props) {
        super(props);

        let sEvent ='', eEvent='';
        if (props.event){
            sEvent = props.event.getTimeStamp();  //wie unterscheide ich zwichen Start u. Ende?
            eEvent = props.event.getTimeStamp();
        }

        /** Den State initiieren */
        this.state = {
            events: [],
            sEvent: new Date().getTime(),
            eEvent: new Date().getTime(),
        };
        //speichert den State, für den Fall, dass abgebrochen wird
        this.baseState = this.state;
    }

    //behandelt das Click Event, dass bei "Abbrechen" ausgelöst wird
    handleClose = () => {
        // den State neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    addProjectStart = () => {
        let newEventBO = new EventBO(this.state.sEvent);
    HdMWebAppAPI.getAPI().addProjectStart(newEventBO).then(event => {
        this.setState(this.baseState);
        //this.props.onClose(event);
    }).catch (e =>
        console.log(e, 'Start'));
    }

    addProjectEnd = () => {
        let newEventBO = new EventBO(this.state.eEvent);
    HdMWebAppAPI.getAPI().addProjectEnd(newEventBO).then(event => {
        this.setState(this.baseState);
        //this.props.onClose(event);
    }).catch (e =>
        console.log(e, 'Ende'));
    }

    /** Im Fall von bearbeiten Überschreibt es das ProjectBO mit neuen Werten */
   updateProjectStart = () => {
       // das originale Project klonen, für den Fall, dass der Backend Call fehlschlägt.
       let updatedProjectStart = Object.assign(new EventBO(), this.props.event);
       // setzen der neuen Attribute aus dem Dialog
       updatedProjectStart.setTimestamp(this.state.sEvent);
       HdMWebAppAPI.getAPI().updateProjectStart(updatedProjectStart).then(event => {
           // den neuen state als baseState speichern
           this.baseState.sEvent = this.state.sEvent;
           //this.props.onClose(updatedProject);
       })
   }

   /** Im Fall von bearbeiten Überschreibt es das ProjectBO mit neuen Werten */
   updateProjectEnd = () => {
       // das originale Project klonen, für den Fall, dass der Backend Call fehlschlägt.
       let updatedProjectEnd = Object.assign(new EventBO(), this.props.event);
       // setzen der neuen Attribute aus dem Dialog
       updatedProjectEnd.setTimestamp(this.state.eEvent);
       HdMWebAppAPI.getAPI().updateProjectEnd(updatedProjectEnd).then(event => {
           // den neuen state als baseState speichern
           this.baseState.eEvent = this.state.eEvent;
           //this.props.onClose(updatedProject);
       })
   }




    /**componentDidMount() {
        this.getEventForTimeIntervalTransactions(this.state.startDate, this.state.endDate)
    }*/

    render() {
        const {events, sEvent, eEvent} = this.state;
        const {event, show} = this.props
        //console.log(sEvent)
        //console.log(eEvent)

        let header ='';
        let title = '';

        if (event) {
            title = 'bearbeiten';
            header = 'test';
        } else {
            title= 'neu machen';
            header ='neu'
        }

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


                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={"Start Date"}
                                    value={sEvent}
                                    onChange={(date) => {
                                        this.setState({sEvent: date.getTime()});
                                        this.updateProjectStart(date.getTime(), this.state.sEvent)
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={"End Date"}
                                    value={eEvent}
                                    onChange={(date) => {
                                        this.setState({eEvent: date.getTime()});
                                        console.log(date.getTime())
                                        this.updateProjectEnd(this.state.eEvent, date.getTime())
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>

                        {/**Falls es bereits ein Projekt gibt, soll der sichern Knopf angezeigt werden, sonst erscheint ein Ertsellen Knopf*/
                            project ?
                                <Button color={"primary"} onClick={this.updateProject}>
                                    Sichern
                                </Button>
                                : <Button color={"primary"} onClick={this.addProject}>
                                    Erstellen
                                </Button>
                        }
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

/** PropTypes*/
ProjectCreateDialog.propTypes = {

    onClose: PropTypes.func.isRequired,

    show: PropTypes.bool.isRequired
}

export default ProjectDurationForm;