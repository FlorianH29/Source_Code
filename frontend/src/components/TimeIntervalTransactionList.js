import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Grid, Typography, TextField} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

class TimeIntervalTransactionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            startDate: new Date(),
            endDate: new Date(),

        }
    }

    getEventForTimeIntervalTransactions = () => {
        HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions()
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
        this.getEventForTimeIntervalTransactions()
    }

    render() {
        const {events, startDate, endDate} = this.state;
        console.log(startDate)
        console.log(endDate)
        //console.log(timeIntervalTransactions)
        return (
            <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={"Start Date"}
                        value={startDate}
                        onChange={(date) => {
                            this.setState({startDate: date})
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={"End Date"}
                        value={endDate}
                        onChange={(date) => {
                            this.setState({endDate: date})
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
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
                        </Grid>
                        <Divider/>
                        {events.map(e =>
                            <TimeIntervalTransactionListEntry key={1} event={e}/>)
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default TimeIntervalTransactionList;