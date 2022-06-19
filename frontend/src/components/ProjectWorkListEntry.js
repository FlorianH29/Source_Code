import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProjectWorkForm from './dialogs/ProjectWorkForm';
import ListItem from "@mui/material/ListItem";
import ProjectWorkDeleteDialog from "./dialogs/ProjectWorkDeleteDialog";


/**
 * Rendert ein ProjectWorkBO innerhalb eines auf- und zuklappbaren ProjectWorkListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes ProjektWorkBO manipuliert werden kann.
 */

class ProjectWorkListEntry extends Component {

  constructor(props) {
    super(props);

    // den state initialisieren
    this.state = {
      projectWork: props.projectWork,
      showProjectWorkForm: false,
      showProjectWorkDeleteDialog: false,
    };
  }

  /** Behandelt das onClick Event des ProjectWork bearbeiten Buttons */
  editProjectWorkButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showProjectWorkForm: true
    });
  }

  /** Behandelt das onClose Event von ProjectWorkForm */
  projectWorkFormClosed = (projectWork) => {
    // projectWork ist nicht null und wurde dementsprechend geändert
    if (projectWork) {
      this.setState({
        projectWork: projectWork,
        showProjectWorkForm: false
      });
    } else {
      this.setState({
        showProjectWorkForm: false
      });
    }
  }

   /** Behandelt das onClose Event von ProjectWorkDeleteDialog */
  deleteProjectWorkDialogClosed = (projectWork) => {
    if (projectWork) {
      this.props.onProjectWorkDeleted(projectWork);
    }
    this.setState({
      showProjectWorkDeleteDialog: false // Den Dialog nicht mehr anzeigen
    });
  }

  /** Behandelt das onClick Event des ProjectWork löschen Buttons */
  deleteProjectWorkButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showProjectWorkDeleteDialog: true
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { projectWork, showProjectWorkForm, showProjectWorkDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <ListItem>
          <Grid container alignItems='center'>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {projectWork.getProjectWorkName()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {projectWork.getDescription()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
              <Typography variant={"h5"} component={"div"}>
                {projectWork.getTimeIPeriod()}
              </Typography>
            </Grid>
            <Grid item xs={3} align={"center"}>
                <Button color='primary' size='small' startIcon={<EditIcon />} onClick={this.editProjectWorkButtonClicked}> </Button>
                <Button color='secondary' size='small' startIcon={<DeleteIcon />} onClick={this.deleteProjectWorkButtonClicked}> </Button>
            </Grid>
          </Grid>
          </ListItem>
          <Divider/>
        <ProjectWorkDeleteDialog show={showProjectWorkDeleteDialog} projectWork={projectWork} onClose={this.deleteProjectWorkDialogClosed} />
        <ProjectWorkForm show={showProjectWorkForm} projectWork={projectWork} onClose={this.projectWorkFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
});

/** PropTypes */
ProjectWorkListEntry.propTypes = {
  /** Das ProjectWorkBO welches gerendert werden soll */
  projectWork: PropTypes.object.isRequired,
  /** Event Handler Funktion, welche aufgerufen wird, nachdem eine Projektarbeit erfolgreich gelöscht wurde. */
  onProjectWorkDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(ProjectWorkListEntry);