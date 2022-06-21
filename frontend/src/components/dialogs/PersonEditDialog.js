import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, IconButton, Dialog, DialogTitle, DialogActions, TextField} from '@material-ui/core';
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

    let fn = '', ln = '';
    if (props.person) {
      fn = props.person.getFirstName();
      ln = props.person.getLastName();
    }

    // den state initialisieren
    this.state = {
      firstname: fn,
      lastname: ln,
      firstnameValidationFailed: false,
      lastnameValidationFailed: false
    };
    this.baseState = this.state;
  }

  /** Die Person bearbeiten */
  editPerson = () => {
    let editedPerson = Object.assign(new PersonBO(), this.props.person);
    editedPerson.setFirstName(this.state.firstname);
    editedPerson.setLastName(this.state.lastname);
    HdMWebAppAPI.getAPI().editPerson(editedPerson).then(person => {
      this.baseState.firstname = this.state.firstname;
      this.baseState.lastname = this.state.lastname;
      console.log(this.state);
      this.props.onClose(editedPerson);
      });
  }

  /** Behandelt das Click Event des Buttons Abbrechen */
  handleClose = () => {
    // console.log(this.props);
    this.setState(this.baseState);
    this.props.onClose(null);
  }


  textFieldValueChange = (event) => {
    const value = event.target.value;

    let error = false;
    if (value.trim().length === 0) {
      error = true;
    }

    this.setState({
      [event.target.id]: event.target.value,
      [event.target.id + 'ValidationFailed']: error,
      [event.target.id + 'Edited']: true
    });
  }

  /** Renders the component */
  render() {
    const { person, show } = this.props;
    const {firstnameValidationFailed, lastnameValidationFailed, firstname, lastname}= this.state;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose} maxWidth='xl'>
          <DialogTitle>Person löschen
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
            <form noValidate autoComplete='off'>
              <TextField autoFocus type='text' required fullWidth margin='normal' id='person' label='Vorname:' value={firstname}
                  onChange={this.textFieldValueChange} error={firstnameValidationFailed}
                  helperText={firstnameValidationFailed ? 'Bitte geben Sie Ihren Vornamen an' : ' '} />
                <TextField type='text' required fullWidth margin='normal' id='description' label='Nachname:' value={lastname}
                  onChange={this.textFieldValueChange} error={lastnameValidationFailed}
                  helperText={lastnameValidationFailed ? 'Bitte geben Sie Ihren Nachnamen an' : ' '} />
              </form>
           <DialogActions>
              <Button align="left" onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
                  <Button align="right" color='primary' onClick={this.editPerson}>
                    Sichern
                  </Button>
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