import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Grid, Typography, TextField} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import EventAndTimeIntervalForm from "./dialogs/EventAndTimeIntervalForm";

class TimeIntervalTransactionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            startDate: new Date().getTime(),
            endDate: new Date().getTime(),
            showEventAndTimeIntervalForm: false,
        }
    }

    getEventForTimeIntervalTransactions = (startDate, endDate) => {
        HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions(startDate, endDate)
            .then(eventAndTransaction =>
                this.setState({
                    events: eventAndTransaction
                })
            ).catch(eventAndTransaction =>
            this.setState({
                events: []
            }));
    }

    componentDidMount() {
        this.getEventForTimeIntervalTransactions(this.state.startDate, this.state.endDate)
    }


  /** Behandelt das onClose Event */
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
  }

    render() {
        const {events, startDate, endDate} = this.state;
        const {showEventandTimeIntervalForm, getEventForTimeIntervalTransactions} = this.props
        console.log(events)
        //console.log(endDate)
        return (
            <div>
                <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={"Start Date"}
                            value={startDate}
                            onChange={(date) => {
                                this.setState({startDate: date.getTime()});
                                this.getEventForTimeIntervalTransactions(date.getTime(), this.state.endDate)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={"End Date"}
                            value={endDate}
                            onChange={(date) => {
                                this.setState({endDate: date.getTime()});
                                console.log(date.getTime())
                                this.getEventForTimeIntervalTransactions(this.state.startDate, date.getTime())
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Name </Typography>
                            </Grid>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Start </Typography>
                            </Grid>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Ende </Typography>
                            </Grid>
                            <Grid item xs={2} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {events.map(e =>
                            <TimeIntervalTransactionListEntry key={e.name} event={e} onEventAndTimeIntervalDeleted={1}/>)
                        }
                    </Grid>
                </Grid>
                    <EventAndTimeIntervalForm onClose={this.eventAndTimeIntervalFormClosed}
                                              show={showEventandTimeIntervalForm}></EventAndTimeIntervalForm>
                </div>
        );
    }
}

export default TimeIntervalTransactionList;