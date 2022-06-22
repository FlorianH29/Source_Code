import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Button, Grid, Typography, Divider, Dialog, DialogActions, DialogContent} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DepartureBO from "../api/DepartureBO";
import firebase from "firebase/compat/app";
import PersonDeleteDialog from "./dialogs/PersonDeleteDialog";
import DepartureDialog from "./dialogs/DepartureDialog";

class Departure extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openDepartureDialog: false,  // Status der Anzeige von Dialog, ob der Mitarbeiter wirklich gehen möchte
            updatingError: null
        }
    }

    /** Erstellen eines Departure-Events und Abmelden des Mitarbeiters*/
    addNewDepartureEvent = () => {
        // Umschalten des Status der Knöpfe
        this.setState({

            openDepartureDialog: true,
            updatingError: null
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

    handleDepartureButtonClicked = () => {
        // Umschalten des Status der Knöpfe
        this.setState({

            openDepartureDialog: true
        });

    }


    /** Schließen des DepartureDialogs */
    handleCloseDepartureDialog = () => {
      this.setState({
          openDepartureDialog: false
      })
    }

    // let newCustomer = new CustomerBO(this.state.firstName, this.state.lastName);
    // BankAPI.getAPI().addCustomer(newCustomer).then(customer => {
    //   // Backend call sucessfull
    //   // reinit the dialogs state for a new empty customer
    //   this.setState(this.baseState);
    //   this.props.onClose(customer); // call the parent with the customer object from backend
    // }).catch(e =>
    //   this.setState({
    //     updatingInProgress: false,    // disable loading indicator
    //     updatingError: e              // show error message
    //   })
    // );


    /** Rendern der Komponente */
    render() {
        const {openDepartureDialog} = this.state;

        return (
            <div>
                <Box>
                    <ListItem>
                        <Grid container justifyContent={"center"}>
                            <Grid item xs={6} align={"center"}>
                                <Button variant='contained' color='primary'
                                        onClick={this.handleDepartureButtonClicked}>
                                    Gehen
                                </Button>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider/>
                </Box>
                <DepartureDialog show={openDepartureDialog} onClose={this.handleCloseDepartureDialog}></DepartureDialog>
            </div>
        );
    }
}

Departure.propTypes = {
  /** Das ProjectWorkBO, das gelöscht werden soll */
  person: PropTypes.object.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default Departure;
