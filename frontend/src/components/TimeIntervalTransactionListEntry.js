import React, {Component} from 'react';
import ListItem from "@mui/material/ListItem";
import {Grid, Typography} from "@material-ui/core";

/**
 * Rendert ein TimeIntervalTransactionBO innerhalb eines auf- und zuklappbaren TimeIntervalTransactionListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes TimeIntervalTransactionBO manipuliert werden kann.
 */

class TimeIntervalTransactionListEntry extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            timeIntervalTransaction: props.timeIntervalTransaction,
        };
    }


    /** Renders the component */
    render() {
        const {timeIntervalTransaction} = this.state;

        // console.log(this.state);
        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {timeIntervalTransaction.getID()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {timeIntervalTransaction.getID()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {timeIntervalTransaction.getID()}
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
            </div>
        );
    }
}

export default TimeIntervalTransactionListEntry;