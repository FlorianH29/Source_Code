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

    getTimeIntervalTransactions = async () => {
       await HdMWebAppAPI.getAPI().getTimeIntervalTransactions()
            .then(timeIntervalBO => {
                return timeIntervalBO;
            }).catch(e => {
            return [];
        });
    }

    getEventForTimeIntervalTransactions = async () => {
        await HdMWebAppAPI.getAPI().getEventsForTimeIntervalTransactions()
            .then(eventBO => {
                return eventBO;
            }).catch(e => {
            return [];
        });
    }

    componentDidMount() {
        const evente = this.getEventForTimeIntervalTransactions()
        const timeIntervalTransactionen = this.getTimeIntervalTransactions()
        console.log(evente)
        this.setState({
            events: evente,
            timeIntervalTransactions: timeIntervalTransactionen
        })
    }

    render() {
        const {timeIntervalTransactions, events} = this.state;
        //console.log(events)
        //console.log(timeIntervalTransactions)
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