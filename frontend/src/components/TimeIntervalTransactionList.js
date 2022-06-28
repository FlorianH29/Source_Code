import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Box, Divider, TextField, Typography} from '@material-ui/core';
import {Grid, Card} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

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
        this.setState({events: []}, () => {
            HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions(startDate, endDate)
                .then(eventAndTransaction =>
                    this.setState({
                        events: eventAndTransaction
                    })
                ).catch(eventAndTransaction =>
                this.setState({
                    events: []
                }))
        });
    }

    componentDidMount() {
        this.getEventForTimeIntervalTransactions(this.state.startDate, this.state.endDate)
    }

    timeIntervalRefresh = () => {
        this.getEventForTimeIntervalTransactions(this.state.startDate, this.state.endDate)
    }

    render() {
        const {events, startDate, endDate} = this.state;
        return (
            <div>
                <Box mt={18} ml={21} mr={2} mb={10} pl={8}>
                    <Card>
                    <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                    <Grid container direction={'row'} mt={2} alignItems='stretch' spacing={1}>
                        <Grid item xs={3}/>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={"Start Datum"}
                                value={startDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    this.setState({startDate: date.getTime()});
                                    this.getEventForTimeIntervalTransactions(date.getTime(), this.state.endDate)
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={"End Datum"}
                                value={endDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    this.setState({endDate: date.getTime()});
                                    console.log(date.getTime())
                                    this.getEventForTimeIntervalTransactions(this.state.startDate, date.getTime())
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        </Grid>

                    </div>
                    <Grid container pt={1}>
                        <Grid item xs={12} align={"center"}>
                            <Grid container pt={3}>
                                <Grid item xs={2} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Name </Typography>
                                </Grid>
                                <Grid item xs={3} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Start </Typography>
                                </Grid>
                                <Grid item xs={3} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Ende </Typography>
                                </Grid>
                                <Grid item xs={2} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Dauer </Typography>
                                </Grid>
                            </Grid>
                            <Divider/>
                            {events.map(e =>
                                <TimeIntervalTransactionListEntry key={e} event={e}
                                                                  onClose={this.timeIntervalRefresh}/>)
                            }
                        </Grid>
                    </Grid>
                        </Card>
                </Box>
            </div>
        );
    }
}

export default TimeIntervalTransactionList;