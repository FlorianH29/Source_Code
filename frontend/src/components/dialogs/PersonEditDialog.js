import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI, PersonBO } from '../../api';



/**
 * Anzeigen eines Löschdialogs, der fragt, ob eine Person gelöscht werden soll. Das ProjectWorkBO welches
 * gelöscht werden soll, muss per prop übergeben werden. Je nach der Nutzerinteraktion wird der entsprechende Backend
 * Aufruf ausgelöst. Daraufhin wird die Funktion der onClose Property mit dem gelöschten ProjectWork als Parameter
 * aufgerufen. Wenn der Dialog geschlossen wird, wird onClose null übergeben.
 */

class PersonEditDialog extends Component {

  constructor(props) {
    super(props);

    // den state initialisieren
    this.state = {
      deletingInProgress: false,
      deletingError: null
    };
  }

  /** Die Person bearbeiten */
  editPerson = () => {
    HdMWebAppAPI.getAPI().deletePerson(this.props.person.getID).then(person => {
      this.props.onClose(this.props.person);  // call the parent with the deleted customer
    }).catch(e =>
        console.log(e))
  }

  /** Behandelt das Click Event des Buttons Abbrechen */
  handleClose = () => {
    // console.log(this.props);
    this.props.onClose(null);
  }




  /** Renders the component */
  render() {
    const { person, show } = this.props;
    const {personNameValidationFailed,descriptionValidationFailed, personvorname, personnachname}= this.state;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose}>
          <DialogTitle>Person löschen
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
            <form noValidate autoComplete='off'>
              <TextField autoFocus type='text' required fullWidth margin='normal' id='person' label='Vorname:' value={personvorname}
                  onChange={this.textFieldValueChange} error={personNameValidationFailed}
                  helperText={personNameValidationFailed ? 'Bitte geben Sie ihren Vornamen an' : ' '} />
                <TextField type='text' required fullWidth margin='normal' id='description' label='Nachname:' value={personnachname}
                  onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                  helperText={descriptionValidationFailed ? 'Bitte geben Sie ihren Nachnamen an' : ' '} />
              </form>
           <DialogActions>
              <Button onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
              {// Falls eine Projektarbeit gegeben ist, sichern Knopf anzeigen, sonst einen Erstellen Knopf
                person ?
                  <Button color='primary' onClick={this.updatePerson}>
                    Sichern
                  </Button>
                  : <Button color='primary' onClick={this.addEvent}>
                    Erstellen
                  </Button>
              }
            </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** PropTypes */
PersonEditDialog.propTypes = {
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


export default PersonEditDialog;
