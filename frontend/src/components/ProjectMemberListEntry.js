import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Divider,} from '@material-ui/core';
import {Button, ButtonGroup} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ProjectMemberDeleteDialog from "./dialogs/ProjectMemberDeleteDialog"

class ProjectMemberListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            projectMember: props.projectMember,
            showProjectMemberDeleteDialog: false,
        };
    }

    /**    editProjectMemberButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showActivityForm: true
    });
    }
     */

    deleteProjectMemberButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectMemberDeleteDialog: true
        });
    }

    deleteProjectMemberDialogClosed = (projectMember) => {
        if (projectMember) {
            this.props.onActivityDeleted(projectMember);
        }
        this.setState({
            showProjectMemberDeleteDialog: false // Den Dialog nicht mehr anzeigen
        });
    }

    render() {
        const {classes} = this.props;
        const {projectMember, person, showProjectMemberDeleteDialog} = this.state;

        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {projectMember.getFirstName()}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {projectMember.getLastName()}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            {/** <Button color='primary' size='small' startIcon={<EditIcon />}
                                    onClick={this.editProjectMemberButtonClicked}> </Button>*/}
                            <Button color='secondary' size='small' startIcon={<DeleteIcon/>}
                                    onClick={this.deleteProjectMemberButtonClicked}> </Button>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <ProjectMemberDeleteDialog show={showProjectMemberDeleteDialog} projectMember={projectMember}
                                      onClose={this.deleteProjectMemberDialogClosed}/>
            </div>
        );
    }


}

ProjectMemberListEntry.propTypes = {
  classes: PropTypes.object.isRequired,
  /** Das ActivityBO welches gerendert werden soll */
  projectMember: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  /** Event Handler Funktion, welche aufgerufen wird, nachdem eine Projektarbeit erfolgreich gelöscht wurde. */
  onActivityDeleted: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default ProjectMemberListEntry;