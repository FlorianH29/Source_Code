import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI } from '../../api';

/**
 * Anzeigen eines Löschdialogs, der fragt, ob ein Projektarbeitsobjekt gelöscht werden soll. Das ProjectWorkBO welches
 * gelöscht werden soll, muss per prop übergeben werden. Je nach der Nutzerinteraktion wird der entsprechende Backend
 * Aufruf ausgelöst. Daraufhin wird die Funktion der onClose Property mit dem gelöschten ProjectWork als Parameter
 * aufgerufen. Wenn der Dialog geschlossen wird, wird onClose null übergeben.
 */

class ProjectWorkDeleteDialog extends Component {

  constructor(props) {
    super(props);

    // den state initialisieren
    this.state = {
      deletingInProgress: false,
      deletingError: null
    };
  }

  /** Die Projektarbeit löschen */
  deleteProjectWork = () => {
    HdMWebAppAPI.getAPI().deleteProjectWork(this.props.projectWork.getID()).then(projectWork => {
      this.props.onClose(this.props.projectWork);  // call the parent with the deleted customer
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
    const { projectWork, show } = this.props;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose}>
          <DialogTitle>Projektarbeit löschen
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Die Projektarbeit '{projectWork.getProjectWorkName}' (ID: {projectWork.getID()}) wirklich löschen?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              Abbrechen
            </Button>
            <Button variant='contained' onClick={this.deleteProjectWork} color='primary'>
              Löschen
            </Button>
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** PropTypes */
ProjectWorkDeleteDialog.propTypes = {
  /** Das ProjectWorkBO, das gelöscht werden soll */
  projectWork: PropTypes.object.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default ProjectWorkDeleteDialog;