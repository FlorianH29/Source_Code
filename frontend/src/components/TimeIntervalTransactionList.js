import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Grid, Typography} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"

class TimeIntervalTransactionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timeIntervalTransactions: [],
            events: [],
        }
    }

    getTimeIntervalTransactions = () => {
        HdMWebAppAPI.getAPI().getTimeIntervalTransactions()
            .then(timeIntervalTransactionBO =>
                this.setState({
                    timeIntervalTransactions: timeIntervalTransactionBO
                })).catch(e =>
            this.setState({
                timeIntervalTransactions: []
            }));
    }

    getEventForTimeIntervalTransactions = () => {
        HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions()
            .then(eventBO =>
                this.setState({
                    events: eventBO
                })).catch(e =>
            this.setState({
                events: []
            }))
    }

    componentDidMount() {
        this.getTimeIntervalTransactions();
        this.getEventForTimeIntervalTransactions();
    }

    render() {
        const {timeIntervalTransactions, events} = this.state;
        console.log(events)
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Name </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Start </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Ende </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {timeIntervalTransactions.map(tit =>
                            <TimeIntervalTransactionListEntry key={tit.getID()} timeIntervalTransaction={tit}/>)
                        }
                        {events.map(e =>
                            <TimeIntervalTransactionListEntry key={e.getID()} event={e}/>)
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default TimeIntervalTransactionList;