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
import DepartureBO from "../../api/DepartureBO";


/**
 * Dialog, welcher angezeigt werden soll, wenn der Mitarbeiter "Gehen" buchen und sich Abmelden möchte.
 *
 * "Möchten Sie wirklich gehen?" -> ja/nein
 */

class DepartureDialog extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            openDepartureDialog: true
        };
    }

    /** Erstellen eines Departure-Events und Abmelden des Mitarbeiters*/
    addNewDepartureEvent = () => {
        // Umschalten des Status der Knöpfe
        this.setState({
            openDepartureDialog: true,
        });
        // Erstellen eines Gehen-Ereignis
        let newDepartureEvent = new DepartureBO()
        HdMWebAppAPI.getAPI().addDeparture().then(departure => {
            // Backend call successful
            // reinit the dialogs state for a new empty customer
            this.setState(this.baseState);
            this.props.onClose(departure); // call the parent with the departure object from backend
        }).catch(e =>
            console.log(e)
        );
        // Mitarbeiter ausloggen, wenn Gehen-Event erstellt wurde
        firebase.auth().signOut();
    }

    /** Behandelt das Click Event des Buttons Abbrechen */
    handleClose = () => {
        // console.log(this.props);
        this.props.onClose(null);
    }


    /** Renders the component */
    render() {
        const {show} = this.props;


        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>Gehen und Abmelden
                        <IconButton onClick={this.handleClose} color={'primary'}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Wollen Sie wirklich gehen und sich ausloggen?
                        </DialogContentText>
                        <DialogContentText>
                            Wenn Sie sich in einer laufenden Projektarbeit oder Pause befinden, wird diese für Sie
                            beendet.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button variant='contained' onClick={() => {
                            this.addNewDepartureEvent()
                        }} color='primary'>
                            Gehen & Abmelden
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}



export default DepartureDialog;