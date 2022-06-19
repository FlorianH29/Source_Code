import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI } from '../../api';

/**
 * Der DeleteDialog wird angezeigt, wenn eine vorher angelegte Aktivität gelöscht werden soll.
 * Sie bewirkt, dass wie es im Backend definiert ist die Aktivität in der Datenbank von 0 auf 1 gesetzt wird
 * und somit als gelöscht makiert und im Frondend nicht mehr sichtbar ist.
 */

class ProjectMemberDeleteDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deletingInProgress: false,
            deletingError: null
        };
    }

    deleteProjectMember = () => {
    HdMWebAppAPI.getAPI().deleteProjectMember(this.props.projectMember.getID()).then(projectMember => {
      this.setState({
        deletingInProgress: false,              // disable loading indicator
        deletingError: null                     // no error message
      });
      this.props.onClose(this.props.projectMember);  // call the parent with the deleted customer
    }).catch(e =>
      this.setState({
        deletingInProgress: false,              // disable loading indicator
        deletingError: e                        // show error message
      })
    );

    // set loading to true
    this.setState({
      deletingInProgress: true,                 // show loading indicator
      deletingError: null                       // disable error message
    });
    }

    handleClose = () => {
    this.props.onClose(null);
    }

    render() {
        const { projectMember, show } = this.props;
        const { deletingInProgress, deletingError } = this.state;

        return (
        show ?
            <Dialog open={show} onClose={this.handleClose}>
                <DialogTitle id='delete-dialog-title'>Projektmitarbeiter aus dem Projekt löschen
                    <IconButton onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Den Mitarbeiter '{projectMember.getFirstName()} {projectMember.getLastName()}'
                        wirklich aus dem Projekt löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color='secondary'>
                        Abbrechen
                    </Button>
                    <Button variant='contained' onClick={this.deleteProjectMember} color='primary'>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            : null
        );
    }

}

ProjectMemberDeleteDialog.propTypes = {
  /** Das ActivityBO, das gelöscht werden soll */
  projectMember: PropTypes.object.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ActivityBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default ProjectMemberDeleteDialog;