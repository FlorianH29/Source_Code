import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI, ProjectWorkBO } from '../../api';

/**
 * Zeigt einen Dialog, der es dem Projektleiter (und nur diesem) ermöglicht die Attribute eines Objektes anzupassen. So
 * können Projektbezeichnung, der Kunde, der Auftragsteller oder das zugehörige Interval geändert/ angepasst werden.
 */
class ProjectChangeForm extends Component {

  constructor(props) {
    super(props);

    let pn = '', cl = '', ow = '', ti = null;
    if (props.project) {
      pn = props.project.getProjectName();  // Hier wird die Projektbezeichnung geholt
      cl = props.project.getClient();  // Hier wird der Client geholt
      ow = props.project.getOwner();  // Hier wird der Owner geholt
      ti = props.project.getTimeInterval();  // Hier wird der TimeInterval geholt
    }

    // Init the state
    this.state = {
      projectName: pn,
      client: cl,
      owner: ow,
      timeInterval: ti,
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

  addProject = () => {
    console.log('addProject durchgeführt')
  }

  addClient = () => {
      console.log('addClient durchgeführt')
  }

  addOwner = () => {
      console.log('addOwner durchgeführt')
  }

  addtimeInterval = () => {
      console.log('addTimeInterval durchgeführt')
  }

  addStartEventandProjectWork = () => {
    this.addEvent();
    this.addProjectWork();
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

  /** Überschreibt das ProjectBO mit neuen Werten */
  updateProject = () => {
    // das originale ProjectWork klonen, für den Fall, dass Backend Call fehlschlägt
    let updatedProject = Object.assign(new ProjectBO(), this.props.project);
    // setzen der neuen Attribute aus dem Dialog
    updatedProject.setProjectWorkName(this.state.projectWorkName);
    updatedProject.setDescription(this.state.description);
    HdMWebAppAPI.getAPI().updateProjectWork(updatedProject).then(project => {
      // den neuen state als baseState speichern
      this.baseState.projectWorkName = this.state.projectWorkName;
      this.baseState.description = this.state.description;
      this.props.onClose(updatedProject);
    })
  }

  /** Renders the component */
  render() {
    const { projectWork, show } = this.props;
    const { projectWorkName, description, projectNameValidationFailed, descriptionValidationFailed } = this.state;

    let title = '';
    let header = '';

    if (projectWork) {
      // ProjectWork definiert, Bearbeitungsdialog wird angezeigt
      title = 'Projektarbeit bearbeiten';
      header = `Projektarbeit ID: ${projectWork.getID()}`;
    } else {
      // ProjectWork ist nicht definiert, Erstellungsdialog wird angezeigt
      title = 'Neue Projekt erstellen';
      // In diesem Dialog werden nur Name des Projekts, Kunde des Projekts und Zeitinterval abgefragt. Der Owner/
      // Projektleiter lässt sich nicht ändern.
      header = 'Geben Sie Name, Kunde und Zeitinterval an';
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
                <!--In diesem Textfeld wird der Name des Projekts angegeben. -->
                <TextField autoFocus type='text' required fullWidth margin='normal' id='projectName' label='Name:' value={projectWorkName}
                  onChange={this.textFieldValueChange} error={projectNameValidationFailed}
                  helperText={projectNameValidationFailed ? 'Bitte geben Sie einen Projektnamen an' : ' '} />
                <!--In diesem Textfeld wird der Client/ Kunde des Projekts angegeben. -->
                <TextField type='text' required fullWidth margin='normal' id='description' label='Beschreibung:' value={description}
                  onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                  helperText={descriptionValidationFailed ? 'Bitte geben Sie eine Beschreibung an' : ' '} />
                <!--In diesem Textfeld wird das Zeitinterval des Projekts angegeben. -->
                <TextField type='text' required fullWidth margin='normal' id='description' label='Beschreibung:' value={description}
                  onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                  helperText={descriptionValidationFailed ? 'Bitte geben Sie eine Beschreibung an' : ' '} />
                <!--In diesem Textfeld wird  angegeben. -->
                <TextField type='text' required fullWidth margin='normal' id='description' label='Beschreibung:' value={description}
                  onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                  helperText={descriptionValidationFailed ? 'Bitte geben Sie eine Beschreibung an' : ' '} />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color='secondary'>
                Abbrechen
              </Button>
              {// Falls eine Projekt gegeben ist, sichern Knopf anzeigen, sonst einen Erstellen Knopf
                projectWork ?
                  <Button color='primary' onClick={this.updateProject}>
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
ProjectForm.propTypes = {

  onClose: PropTypes.func.isRequired,

  show: PropTypes.bool.isRequired,
}

export default ProjectChangeForm;