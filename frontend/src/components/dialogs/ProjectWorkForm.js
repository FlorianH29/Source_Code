import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {EventBO, HdMWebAppAPI, ProjectWorkBO} from '../../api';
import EventManager from "../EventManager";

/**
 * Zeigt einen Dialog für eine Projekarbeit. Wenn die Projektarbeit gesetzt ist, stellt der Dialog eine Möglichkeit zum
 * Bearbeiten dar und die Textfelder sind mit den Werten des gegebenen ProjectWorkBO gefüllt.
 * Wenn die Projektarbeit null ist, stellt der Dialog eine Möglichkeit zum Erstellen eines neuen ProjectWorkBO dar und
 * die Textfelder sind leer. Abhängig vom Status des Dialogs werden die entsprechenden Backendcalls ausgeführt.
 * Danach wird die Funktion des onClose prop mit den erstellten/bearbeiteten ProjectWorkBO als Parameter aufgerufen.
 * Wenn der Dialog abgebrochen wird, wird onClose mit null aufgerufen.
 */
class ProjectWorkForm extends Component {

  constructor(props) {
    super(props);

    let pwn = '', de = '',  act = 0;
    if (props.projectWork) {
      pwn = props.projectWork.getProjectWorkName();
      de = props.projectWork.getDescription();
      act = 1;
    }

    // Den State initiieren
    this.state = {
      projectWorkName: pwn,
      description: de,
      affiliatedActivity: act,
      projectWorkNameValidationFailed: false,
      descriptionValidationFailed: false
    };
    // den state speichern, für den Fall, dass abgebrochen wird
    this.baseState = this.state;
  }

  /** Behandelt das click event für den Button Abbrechen*/
  handleClose = () => {
    // den state neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
    this.setState(this.baseState);
    this.props.onClose(null);
  }

  /** Erstellt ein neues ProjectWorkBO */
  addProjectWork = () => {
    let newProjectWorkBO = new ProjectWorkBO(this.state.projectWorkName, this.state.description,
        this.state.affiliatedActivity);
    console.log(this.state)
    HdMWebAppAPI.getAPI().addProjectWork(newProjectWorkBO).then(projectWork => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty customer
      this.setState(this.baseState);
      this.props.onClose(projectWork); // call the parent with the customer object from backend
    }).catch(e =>
    console.log(e));
  }

  /** Behandelt Wertänderungen der Textfelder und validiert diese */
  textFieldValueChange = (event) => {
    const value = event.target.value;

    let error = false;
    if (value.trim().length === 0) {
      error = true;
    }

    this.setState({
      [event.target.id]: event.target.value,
      [event.target.id + 'ValidationFailed']: error,
      [event.target.id + 'Edited']: true,
    });
  }

  /** Überschreibt das ProjectWorkBO mit neuen Werten */
  updateProjectWork = () => {
    // das originale ProjectWork klonen, für den Fall, dass Backend Call fehlschlägt
    let updatedProjectWork = Object.assign(new ProjectWorkBO(), this.props.projectWork);
    // setzen der neuen Attribute aus dem Dialog
    updatedProjectWork.setProjectWorkName(this.state.projectWorkName);
    updatedProjectWork.setDescription(this.state.description);
    HdMWebAppAPI.getAPI().updateProjectWork(updatedProjectWork).then(projectWork => {
      // den neuen state als baseState speichern
      this.baseState.projectWorkName = this.state.projectWorkName;
      this.baseState.description = this.state.description;
      this.props.onClose(updatedProjectWork);
    })
  }

  /** Rendert die Komponente */
  render() {
    const { projectWork, show } = this.props;
    const { projectWorkName, description, projectWorkNameValidationFailed, descriptionValidationFailed } = this.state;

    let title = '';
    let header = '';

    if (projectWork) {
      // ProjectWork definiert, Bearbeitungsdialog wird angezeigt
      title = 'Projektarbeit bearbeiten';
      header = `Projektarbeit ID: ${projectWork.getID()}`;
    } else {
      // ProjectWork ist nicht definiert, Erstellungsdialog wird angezeigt
      title = 'Start buchen und neue Projektarbeit erstellen';
      header = 'Geben Sie bitte Name und Beschreibung an';
    }

    return (
        show ?
          <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
            <DialogTitle id='form-dialog-title'>{title}
              <IconButton onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {header}
              </DialogContentText>
                <form noValidate autoComplete='off'>
                <TextField autoFocus type='text' required fullWidth margin='normal' id='projectWorkName' label='Name:' value={projectWorkName}
                  onChange={this.textFieldValueChange} error={projectWorkNameValidationFailed}
                  helperText={projectWorkNameValidationFailed ? 'Bitte geben Sie einen Namen an' : ' '} />
                <TextField type='text' required fullWidth margin='normal' id='description' label='Beschreibung:' value={description}
                  onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                  helperText={descriptionValidationFailed ? 'Bitte geben Sie eine Beschreibung an' : ' '} />
              </form>
            </DialogContent>
            <DialogActions>
              <Button algin="left" onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
              {// Falls eine Projektarbeit gegeben ist, sichern Knopf anzeigen, der diese updatet, sonst Ende buchen
                // Knopf, der Ereignis mit dem Typ 2 erstellt und daraufhin die Projektarbeit erstellt
                projectWork ?
                  <Button color='primary' onClick={this.updateProjectWork}>
                    Sichern
                  </Button>
                  : <EventManager eventType={1} onClose={this.handleClose} functionAddProjectWork={this.addProjectWork}
                        projectWorkName={projectWorkName} des={description}>
                    </EventManager>
              }
            </DialogActions>
          </Dialog>
            : null
    );
  }
}

/** PropTypes */
ProjectWorkForm.propTypes = {

  //onClose: PropTypes.func.isRequired,

  show: PropTypes.bool.isRequired,
}

export default ProjectWorkForm;