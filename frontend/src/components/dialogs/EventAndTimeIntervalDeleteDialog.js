import React, {Component} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from '@material-ui/core';
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

    /** Das Zeitintervall löschen */
    deleteTimeInterval = () => {
        HdMWebAppAPI.getAPI().deleteTimeInterval(this.props.event.timeintervaltransactionid).then(timeInterval => {
            this.props.onClose();
        }).catch(e =>
            console.log(e))
    }

    /** Behandelt das Click Event des Buttons Abbrechen */
    handleClose = () => {
        this.props.onClose();
    }

    /** Rendert die Komponente */
    render() {
        const {event, show} = this.props;
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
                            Das Zeitintervall '{event.name}' wirklich löschen?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button variant='contained' onClick={this.deleteTimeInterval} color='primary'>
                            Löschen
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

export default EventAndTimeIntervalDeleteDialog;