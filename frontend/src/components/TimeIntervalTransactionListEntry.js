import React, {Component} from 'react';
import ListItem from "@mui/material/ListItem";
import {Button, Divider, Grid, Typography} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

    /** Behandelt das onClose Event von showEventandTimeIntervalForm */
    eventAndTimeIntervalFormClosed = (event) => {
        if (event) {
            this.setState({
                event: event,
                showEventandTimeIntervalForm: false
            });
        } else {
            this.setState({
                showEventandTimeIntervalForm: false
            });
        }
    }

    /** Behandelt das onClose Event von eventAndTimeIntervalDeleteDialog */
    deleteEventAndTimeIntervalDialogClosed = (eventAndTimeInterval) => {
        if (eventAndTimeInterval) {
            this.props.onEventAndTimeIntervalDeleted(eventAndTimeInterval);
        }
        this.setState({
            showEventandTimeIntervalDeleteDialog: false // Den Dialog nicht mehr anzeigen
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
        //console.log(event)
        console.log(event.start_time);
        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {event.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"center"}>
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
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {
                                    event.name != 'Kommen' ?
                                        new Date(event.end_time).toLocaleString('de-DE', {
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
                        <Grid item xs={3} align={"center"}>
                            {
                                event.name != 'Kommen' && event.name != 'Gehen' ?
                                    <Button color='primary' size='small' startIcon={<EditIcon/>}
                                            onClick={this.editEventAndTimeIntervalButtonClicked}> </Button>
                                    : ''
                            }
                            {/*  <Button color='secondary' size='small' startIcon={<DeleteIcon/>}
                                    onClick={this.deleteEventAndTimeIntervalButtonClicked}> </Button> */}
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                {
                    /*  <ProjectWorkDeleteDialog show={showEventandTimeIntervalDeleteDialog} event={event}
                                               onClose={this.deleteEventAndTimeIntervalDialogClosed}/> */ }
                    <EventAndTimeIntervalForm show={showEventandTimeIntervalForm} event={event}
                                     onClose={this.eventAndTimeIntervalFormClosed}/>

            </div>
        );
    }
}

export default TimeIntervalTransactionListEntry;