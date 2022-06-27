import React, {Component} from 'react';
import {Button, Divider, Grid} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import DepartureDialog from "./dialogs/DepartureDialog";

class Departure extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openDepartureDialog: false,  // Status der Anzeige von Dialog, ob der Mitarbeiter wirklich gehen möchte
        }
    }

    /** Wenn Gehen-Button gedrückt wird soll der Dialog mit der
     * "Wirklich gehen?"-Abfrage angezeigt werden. Hierfür wird
     * "openDepartureDialog" auf true gesetzt.
     */
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


export default Departure;
