import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI, ProjectWorkBO } from '../../api';

/**
 * Shows a modal form dialog for a CustomerBO in prop customer. If the customer is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given CustomerBO object.
 * If the customer is null, the dialog is configured as a new customer dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a customer.
 * After that, the function of the onClose prop is called with the created/update CustomerBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 */
class ProjectWorkForm extends Component {

  constructor(props) {
    super(props);

    let pwn = '', de = '';
    if (props.projectWork) {
      pwn = props.projectWork.getProjectWorkName();
      de = props.projectWork.getDescription();
    }

    // Init the state
    this.state = {
      projectWorkName: pwn,
      description: de,
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
      [event.target.id + 'Edited']: true
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

  /** Renders the component */
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
      title = 'Neue Projektarbeit erstellen';
      header = 'Geben Sie Name und Beschreibung an';
    }

    return (
        show ?
          <Dialog open={true} onClose={this.handleClose} maxWidth='xs'>
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
              <Button onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
              {// Falls eine Projektarbeit gegeben ist, sichern Knopf anzeigen, sonst einen Erstellen Knopf
                projectWork ?
                  <Button color='primary' onClick={this.updateProjectWork}>
                    Sichern
                  </Button>
                  : <Button color='primary'>
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
ProjectWorkForm.propTypes = {

  onClose: PropTypes.func.isRequired,

  show: PropTypes.bool.isRequired,
}

export default ProjectWorkForm;