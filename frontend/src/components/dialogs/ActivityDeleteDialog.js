import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI } from '../../api';


class ActivityDeleteDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deletingInProgress: false,
            deletingError: null
        };
    }

    deleteActivity = () => {
    HdMWebAppAPI.getAPI().deleteActivity(this.props.activity.getID()).then(activity => {
      this.setState({
        deletingInProgress: false,              // disable loading indicator
        deletingError: null                     // no error message
      });
      this.props.onClose(this.props.activity);  // call the parent with the deleted customer
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
        const { activity, show } = this.props;
        const { deletingInProgress, deletingError } = this.state;

        return (
        show ?
            <Dialog open={show} onClose={this.handleClose}>
                <DialogTitle id='delete-dialog-title'>Delete customer
                    <IconButton onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Die Aktivität '{activity.getActivityName()}' (ID: {activity.getID()}) wirklich löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color='secondary'>
                        Abbrechen
                    </Button>
                    <Button variant='contained' onClick={this.deleteActivity} color='primary'>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            : null
        );
    }

}

ActivityDeleteDialog.propTypes = {
  /** Das ProjectWorkBO, das gelöscht werden soll */
  activity: PropTypes.object.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default ActivityDeleteDialog;