import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Grid, Typography} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"

class TimeIntervalTransactionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
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
        const {timeIntervalTransactions, events} = this.state;
        console.log(events)
        //console.log(timeIntervalTransactions)
        return (
            <div>
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