import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Button, Grid, Typography, Divider, Dialog, DialogActions, DialogContent} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

class BasicButtons extends Component {

  constructor(props) {
    super(props);

      this.state = {
        showStartBreakButton: true,  // Status zeigt, ob der Pausenstart-Button angezeit bzw. enabled ist
        showEndBreakButton: false,  // Status zeigt, ob der Pausenend-Button angezeit bzw. enabled ist
        showLeaveButton: true,  // Status zeigt, ob der Gehen-Button angezeit bzw. enabled ist
        openLeve: false,  // Status der Anzeige von Dialog, ob Mitarbeiter wirklich gehen möchte
      }
  }

  // Mein Code ------------------------------------

  /** Erstellen der einzelnen Events (Pause-Start, Pause-Ende und Gehen) */
    /** Erstellen eines Pausen-Start-Events */
    addNewBreakStartEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({
          disableBreakStartEvent: false,
          disableBreakEndEvent: true,
          disableLeaveEvent: false,  // solange der Mitarbeiter in einer Pause ist kann er den Gehen-Button nicht
                                     // betätigen. Vorher muss die Pause beendet werden.
          openLeve: false
      });
      // Erstellen eines Pausen-Start-Ereignis

  }

  /** Erstellen eines Pausen-End-Events */
    addNewBreakEndEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({
          disableBreakStartEvent: true,
          disableBreakEndEvent: false,
          disableLeaveEvent: true,
          openLeve: false
      });
  }

  /** Erstellen eines Gehen-Events */
    addNewLeaveEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({
          disableBreakStartEvent: true,
          disableBreakEndEvent: false,
          disableLeaveEvent: true,  // nach dem "leave" wird der Benutzer abgemeldet und der Status des Leave-Event-
                                    // Buttons muss daher nicht geändert werden
          openLeve: false
      });
      // Öffnen eines Dialogs mit der Abfrage, ob Mitarbeiter wirklich gehen möchte

  }


  /** Rendern der Komponente */
  render() {
    const { classes } = this.props;
    const { disableBreakStartEvent, disableBreakEndEvent, disableLeaveEvent, openLeve } = this.state;
    // console.log(this.state)

    return (
        <div>
            <Box>
                <ListItem>
                    <Grid container justifyContent={"center"}>
                        <Grid item xs={6} align={"center"}>
                            <Button variant='contained' disabled={disableBreakStartEvent} color='primary' onClick={this.addNewBreakStartEvent}>
                            Pause starten
                            </Button>

                            <Button variant='contained' disabled={disableBreakEndEvent} color='primary' onClick={this.addNewBreakEndEvent}>
                            Pause beenden
                            </Button>

                            <Button variant='contained' disabled={disableLeaveEvent} color='primary' onClick={this.addNewLeaveEvent}>
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

/** PropTypes */
BasicButtons.propTypes = {

  onClose: PropTypes.func.isRequired,

}

export default BasicButtons;
