import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI, ProjectBO} from "../../api";
import {Divider, Grid, Typography, TextField, Dialog, Button} from "@mui/material";
import ProjectWorkListEntry from "../ProjectWorkListEntry";
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ProjectCreateDialog from "./ProjectCreateDialog";

class ProjectDurationDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date().getTime(),
            endDate: new Date().getTime(),
            eventType: 0,
            showProjectDurationForm: false,
        }
    }


    addProjectDurationStart = () => {
        let newEventBO = new EventBO(this.state.eventType, this.state.startDate);
        HdMWebAppAPI.getAPI().addProjectDurationStart(newEventBO).then(projectStart => {
        this.setState(this.baseState);
        //this.props.onClose(projectStart);
    }).catch (e =>
        console.log(e, 'Werde ich aufgerufen?'));
    }

     handleStartDate = (date) => {
    this.setState({
        startDate: date
    });
  };

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
        const {startDate, endDate, eventType} = this.state;
        const {showProjectDurationForm, getEventForTimeIntervalTransactions} = this.props

        //console.log(endDate)
        return (
            <div>
                <Dialog open={true}>
                <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={"Start Date"}
                            value={startDate}
                            onChange={(date) => {
                                this.setState({ eventType: 7, startDate: date.getTime()});
                                //this.addProjectDurationStart(this.state.eventType, date.getTime(), this.state.startDate)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <Button color={"primary"} onClick={this.addProjectDurationStart}>
                                  Erstellen
                              </Button>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={"End Date"}
                            value={endDate}
                            onChange={(date) => {
                                this.setState({endDate: date.getTime()});
                                console.log(date.getTime())
                                //this.getEventForTimeIntervalTransactions(this.state.startDate, date.getTime())
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                    </Dialog>
                </div>
        );
    }
}

export default ProjectDurationDialog;