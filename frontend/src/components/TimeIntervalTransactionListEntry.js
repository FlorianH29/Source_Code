import React, {Component} from 'react';
import ListItem from "@mui/material/ListItem";
import {Button, Divider, Grid, Typography} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import EventAndTimeIntervalDeleteDialog from "./dialogs/EventAndTimeIntervalDeleteDialog";
import EventAndTimeIntervalForm from "./dialogs/EventAndTimeIntervalForm";


/**
 * Rendert ein TimeIntervalTransactionBO innerhalb eines auf- und zuklappbaren TimeIntervalTransactionListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes TimeIntervalTransactionBO manipuliert werden kann.
 */

class TimeIntervalTransactionListEntry extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            event: props.event,
            showEventandTimeIntervalDeleteDialog: false,
            showEventandTimeIntervalForm: false,
        };
    }

    /** Behandelt das onClick Event des bearbeiten Buttons */
    editEventAndTimeIntervalButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showEventandTimeIntervalForm: true
        });
    }

    /** Behandelt das onClick Event des löschen Buttons */
    deleteEventAndTimeIntervalButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showEventandTimeIntervalDeleteDialog: true
        });
    }


    /** Renders the component */
    render() {
        const {event, showEventandTimeIntervalDeleteDialog, showEventandTimeIntervalForm} = this.state;
        console.log(event)
        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {event.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {
                                    event.name != 'Gehen' ?
                                        new Date(event.start_time).toLocaleString('de-DE', {
                                            dateStyle: "long",
                                            timeStyle: "short"
                                        }) : ''
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {
                                    event.name != 'Kommen' ?
                                        new Date(event.endtime).toLocaleString('de-DE', {
                                            dateStyle: "long",
                                            timeStyle: "short"
                                        }) : ''
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {event.period}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"left"}>
                            <Button color='primary' size='small' startIcon={<EditIcon/>}
                                    onClick={this.editEventAndTimeIntervalButtonClicked}> </Button>
                            {
                                event.name != 'Kommen' && event.name != 'Gehen' && event.name != 'Arbeitszeit' ? (
                                    <>
                                        <Button color='secondary' size='small' startIcon={<RemoveCircleOutlineRoundedIcon/>}
                                                onClick={this.deleteEventAndTimeIntervalButtonClicked}> </Button>

                                    </>) : ''
                            }

                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <EventAndTimeIntervalDeleteDialog show={showEventandTimeIntervalDeleteDialog} event={event}
                                                  onClose={this.props.onClose}/>
                <EventAndTimeIntervalForm show={showEventandTimeIntervalForm} event={event}
                                          onClose={this.props.onClose}/>
            </div>
        );
    }
}

export default TimeIntervalTransactionListEntry;