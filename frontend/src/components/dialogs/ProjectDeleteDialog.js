import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI } from '../../api';

/**
 * Anzeigen eines Löschdialogs, der fragt, ob ein Projekt gelöscht werden soll. Das ProjectBO, welches
 * gelöscht werden soll, muss per prop übergeben werden. Je nach der Nutzerinteraktion wird der entsprechende Backend-
 * Aufruf ausgelöst. Daraufhin wird die Funktion der onClose Property mit dem gelöschten Project als Parameter
 * aufgerufen. Wenn der Dialog geschlossen wird, wird onClose null übergeben.
 */

class ProjectDeleteDialog extends Component {

  constructor(props) {
    super(props);

    /** den State initialisieren */
    this.state = {
      deletingInProgress: false,
      deletingError: null
    };
  }

  /** Das Projekt löschen */
  deleteProject = () => {
    HdMWebAppAPI.getAPI().deleteProject(this.props.project.getID()).then(project => {
      this.props.onClose(this.props.project);  // ruft den Parent mit dem gelöschten Projekt auf.
    }).catch(e =>
        console.log(e))
  }

  /** Behandelt das Click Event des Buttons Abbrechen */
  handleClose = () => {
    // console.log(this.props);
    this.props.onClose(null);
  }

  /** Rendert die Komponente */
  render() {
    const { project, show } = this.props;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose}>
          <DialogTitle>Projekt löschen
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Das Projekt  "{project.getProjectName()}" mit der ID "{project.getID()}" wirklich löschen?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              Abbrechen
            </Button>
            <Button variant='contained' onClick={this.deleteProject} color='primary'>
              Löschen
            </Button >
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** PropTypes */
ProjectDeleteDialog.propTypes = {
  /** Das ProjectBO, das gelöscht werden soll */
  project: PropTypes.object.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ProjectBO als Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default ProjectDeleteDialog;