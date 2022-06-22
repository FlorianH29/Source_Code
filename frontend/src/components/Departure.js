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

class Departure extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openDepartureDialog: false,  // Status der Anzeige von Dialog, ob der Mitarbeiter wirklich gehen möchte
            disableDeparture: false,  // Gehen-Button wird disabled, wenn der Mitarbeiter in einer Aktivität oder Pause ist.
            updatingError: null
        }
    }

    /** Erstellen eines Departure-Events */
    addNewDepartureEvent = () => {
        // Umschalten des Status der Knöpfe
        this.setState({

            openDepartureDialog: true,
            disableDeparture: false,
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
            this.setState({
                updatingInProgress: false,    // disable loading indicator
                updatingError: e              // show error message
            })
        );
        // Mitarbeiter ausloggen, wenn Gehen-Event erstellt wurde
        firebase.auth().signOut();
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
        const {classes} = this.props;
        const {openDepartureDialog} = this.state;
        // console.log(this.state)

        return (
            <div>
                <Box>
                    <ListItem>
                        <Grid container justifyContent={"center"}>
                            <Grid item xs={6} align={"center"}>
                                <Button variant='contained' color='primary'
                                        onClick={this.addNewDepartureEvent}>
                                    Gehen
                                </Button>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider/>
                </Box>
            </div>
        );
    }
}

export default Departure;
