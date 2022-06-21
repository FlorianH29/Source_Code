import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Button, Grid, Typography, Divider, Dialog, DialogActions, DialogContent} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

class Departure extends Component {

  constructor(props) {
    super(props);

      this.state = {
        openDepartureDialog: false,  // Status der Anzeige von Dialog, ob der Mitarbeiter wirklich gehen möchte
        disableDeparture: false  // Gehen-Button wird disabled, wenn der Mitarbeiter in einer Aktivität oder Pause ist.
      }
  }

  /** Erstellen eines Departure-Events */
    addNewDepartureEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({

          openDepartureDialog: true,
          disableDeparture: false
      });
      // Erstellen eines Gehen-Ereignis

  }




  /** Rendern der Komponente */
  render() {
    const { classes } = this.props;
    const { openDepartureDialog } = this.state;
    // console.log(this.state)

    return (
        <div>
            <Box>
                <ListItem>
                    <Grid container justifyContent={"center"}>
                        <Grid item xs={6} align={"center"}>
                            <Button variant='contained' disabled={disableDeparture} color='primary'
                                    onClick={this.addNewDepartureEvent}>
                            Pause starten
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

/** PropTypes */
BasicButtons.propTypes = {

  onClose: PropTypes.func.isRequired,

}

export default Departure;
