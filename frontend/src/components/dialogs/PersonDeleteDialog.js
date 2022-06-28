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
import firebase from "firebase/compat/app";
import {HdMWebAppAPI} from '../../api';


/**
 * Anzeigen eines Löschdialogs, der fragt, ob eine Person gelöscht werden soll. Das ProjectWorkBO welches
 * gelöscht werden soll, muss per prop übergeben werden. Je nach der Nutzerinteraktion wird der entsprechende Backend
 * Aufruf ausgelöst. Daraufhin wird die Funktion der onClose Property mit dem gelöschten ProjectWork als Parameter
 * aufgerufen. Wenn der Dialog geschlossen wird, wird onClose null übergeben.
 */

class PersonDeleteDialog extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            deletingInProgress: false,
            deletingError: null
        };
    }

    handleSignOutButtonClicked = () => {
        firebase.auth().signOut();
    }

    /** Die Person löschen */
    deletePerson = () => {
        HdMWebAppAPI.getAPI().deletePerson().then(person => {
            this.props.onClose(null);
        }).catch(e =>
            console.log(e))
    }

    /** Behandelt das Click Event des Buttons Abbrechen */
    handleClose = () => {
        // console.log(this.props);
        this.props.onClose(null);
    }


    /** Rendert die Komponente*/
    render() {
        const {person, show} = this.props;


        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>Person löschen
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Möchten Sie Ihr Profil wirklich löschen?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button variant='contained' onClick={() => {
                            this.deletePerson();
                            this.handleSignOutButtonClicked();
                            this.handleClose()
                        }} color='primary'>
                            Löschen
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

/** PropTypes */
PersonDeleteDialog.propTypes = {
    /** Das ProjectWorkBO, das gelöscht werden soll */
    person: PropTypes.object.isRequired,
    /**
     * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
     * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
     */
    onClose: PropTypes.func.isRequired,
}


export default PersonDeleteDialog;
