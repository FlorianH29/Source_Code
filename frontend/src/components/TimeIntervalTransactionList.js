import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Divider, Grid, Typography} from "@mui/material";
import TimeIntervalTransactionListEntry from "./TimeIntervalTransactionListEntry"

class TimeIntervalTransactionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timeIntervalTransactions: [],
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

    componentDidMount() {
        this.getTimeIntervalTransactions();
    }

    render() {
  const { timeIntervalTransactions } = this.state;
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Projektarbeit </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Beschreibung </Typography>
                            </Grid>
                            <Grid item xs={3} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {timeIntervalTransactions.map(tit =>
                            <TimeIntervalTransactionListEntry key={tit.getID()} timeIntervalTransaction={tit}/>)
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default TimeIntervalTransactionList;