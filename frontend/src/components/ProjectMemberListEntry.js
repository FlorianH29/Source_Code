import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Divider,} from '@material-ui/core';
import {Button} from '@material-ui/core';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
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

    deleteProjectMemberButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectMemberDeleteDialog: true
        });
    }

    deleteProjectMemberDialogClosed = (projectMember) => {
        if (projectMember) {
            this.props.onProjectMemberDeleted(projectMember);
        }
        this.setState({
            showProjectMemberDeleteDialog: false // Den Dialog nicht mehr anzeigen
        });
        this.props.getProjectMembersOfProject()
    }

    render() {
        const { project } = this.props;
        const {projectMember, showProjectMemberDeleteDialog} = this.state;

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
                            <Button color='secondary' size='small' startIcon={<PersonRemoveRoundedIcon/>}
                                    onClick={this.deleteProjectMemberButtonClicked}> </Button>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <ProjectMemberDeleteDialog show={showProjectMemberDeleteDialog} projectMember={projectMember} project={project}
                                      onClose={this.deleteProjectMemberDialogClosed}/>
            </div>
        );
    }


}

ProjectMemberListEntry.propTypes = {
  projectMember: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
}

export default ProjectMemberListEntry;