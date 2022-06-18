import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI} from '../../api';

/**
 * Anzeigen eines Löschdialogs, der fragt, ob ein Event/TimeInterval gelöscht werden soll. n.
 */

class EventAndTimeIntervalDeleteDialog extends Component {
    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            deletingInProgress: false,
            deletingError: null
        };
    }

    /** Behandelt das Click Event des Buttons Abbrechen */
    handleClose = () => {
        // console.log(this.props);
        this.props.onClose(null);
    }

    /** Renders the component */
    render() {
        const {event, show} = this.props;
        const {deletingInProgress, deletingError} = this.state;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>Event löschen
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Die Projektarbeit '{event.name}' (ID: ) wirklich
                            löschen?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button variant='contained' color='primary'>
                            Löschen
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

export default EventAndTimeIntervalDeleteDialog;