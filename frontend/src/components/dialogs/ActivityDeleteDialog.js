import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
 * Der DeleteDialog wird angezeigt, wenn eine vorher angelegte Aktivität gelöscht werden soll.
 * Sie bewirkt, dass wie es im Backend definiert ist die Aktivität in der Datenbank von 0 auf 1 gesetzt wird
 * und somit als gelöscht makiert und im Frondend nicht mehr sichtbar ist.
 */

class ActivityDeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    deleteActivity = () => {
        HdMWebAppAPI.getAPI().deleteActivity(this.props.activity.getID()).then(activity => {
            this.props.onClose(this.props.activity);  // rufe den Elternteil mit der gelöschten Activity auf
        }).catch(e =>
            console.log(e))
    }

    handleClose = () => {
        this.props.onClose(null);
    }

    render() {
        const {activity, show} = this.props;

        return (
        show ?
            <Dialog open={show} onClose={this.handleClose}>
                <DialogTitle id='delete-dialog-title'>Aktivität löschen
                    <IconButton onClick={this.handleClose}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Die Aktivität '{activity.getActivityName()}' (ID: {activity.getID()}) wirklich löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color='secondary'>
                        Abbrechen
                    </Button>
                    <Button variant='contained' onClick={this.deleteActivity} color='primary'>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            : null
        );
    }

}


export default ActivityDeleteDialog;