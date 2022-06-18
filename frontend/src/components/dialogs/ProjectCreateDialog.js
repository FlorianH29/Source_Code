import React, {Component} from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {HdMWebAppAPI, ProjectBO} from '../../api';
import {Button, DialogActions, TextField} from "@mui/material";
import PropTypes from "prop-types";

class ProjectCreateDialog extends Component {

    constructor(props) {
        super(props);

        let pro = '', cl ='';
        if (props.project){
            pro = props.project.getProjectName();
            cl = props.project.getClient();
        }

        // Den State initiieren

        this.state = {
            projectName: pro,
            client: cl,
            projectNameValidationFailed: false,
            clientValidationFailed: false

        };
        //speichert den State, für den Fall, dass abgebrochen wird
        this.baseState = this.state;
    }

    //behandelt das Click Event, dass bei "Abbrechen" ausgelöst wird
    handleClose = () => {
        // den State neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    /**show = () => {
        console.log("Hallo")
    }*/


    addProject = () => {
        let newProjectBO = new ProjectBO(this.state.projectName, this.state.client); /**Hier muss noch die ID des ausgewählten Zeitintervalles rein.*/
    HdMWebAppAPI.getAPI().addProject(newProjectBO).then(project => {
        this.setState(this.baseState);
        this.props.onClose(project);
    }).catch (e =>
        console.log(e, 'Werde ich aufgerufen?'));
    }

    /** Behandelt Werteänderungen der textfelder und validiert diese*/
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

   /** Im Fall von bearbeiten Überschreibt es das ProjectBO mit neuen Werten */
   updateProject = () => {
       // das originale Project klonen, für den Fall, dass der Backend Call fehlschlägt.
       let updatedProject = Object.assign(new ProjectBO(), this.props.project);
       // setzen der neuen Attribute aus dem Dialog
       updatedProject.setProjectName(this.state.projectName);
       updatedProject.setClient(this.state.client);
       HdMWebAppAPI.getAPI().updateProject(updatedProject).then(project => {
           // den neuen state als baseState speichern
           this.baseState.projectName = this.state.projectName;
           this.baseState.client = this.state.client;
           this.props.onClose(updatedProject);
       })
   }

  /** Rendert die Komponente */
  render() {
      const {project, show} = this.props;
      const {projectName, client, projectNameValidationFailed, clientValidationFailed} = this.state;

      let header = '';
      let title = '';

      if (project) {
          // ProjectWork definiert, Bearbeitungsdialog wird angezeigt
          title = 'Projekt bearbeiten';
          header = `Projekt \x22${project.getProjectName()}\x22 des Klienten \x22${project.getClient()}\x22`;
      } else {
          // ProjectWork ist nicht definiert, Erstellungsdialog wird angezeigt
          title = 'Neues Projekt anlegen';
          header = 'Geben Sie bitte Name und Klienten an';
      }

      return (
          show ?
              <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
                  <DialogTitle id='form-dialog-title'>{title}
                      <IconButton onClick={this.handleClose}>
                          <CloseIcon/>
                      </IconButton>
                  </DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                          {header}
                      </DialogContentText>
                      <form noValidate autoComplete='off'>
                          <TextField autoFocus type='text' required fullWidth margin='normal' id='projectName'
                                     label='Name:' value={projectName}
                                     onChange={this.textFieldValueChange} error={projectNameValidationFailed}
                                     helperText={projectNameValidationFailed ? 'Bitte geben Sie einen Namen an' : ' '}/>
                          <TextField type='text' required fullWidth margin='normal' id='client' label='Klient: '
                                     value={client}
                                     onChange={this.textFieldValueChange} error={clientValidationFailed}
                                     helperText={clientValidationFailed ? 'Bitte geben Sie einen Klienten an' : ' '}/>
                      </form>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleClose} color='secondary'>
                          Abbrechen
                      </Button>

                      {/**Falls es bereits ein Projekt gibt, soll der sichern Knopf angezeigt werden, sonst erscheint ein Ertsellen Knopf*/
                          project ?
                              <Button color={"primary"} onClick={this.updateProject}>
                                  Sichern
                              </Button>
                              : <Button color={"primary"} onClick={this.addProject}>
                                  Erstellen
                              </Button>
                      }
                  </DialogActions>
              </Dialog>
              : null
      );
  }
}

/** PropTypes*/
ProjectCreateDialog.propTypes = {

    onClose: PropTypes.func.isRequired,

    show: PropTypes.bool.isRequired
}


export default ProjectCreateDialog;