import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Grid, Typography,} from '@material-ui/core';
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
        const { project, person } = this.props;
        const {projectMember, showProjectMemberDeleteDialog} = this.state;

        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {projectMember.getFirstName()}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {projectMember.getLastName()}
                            </Typography>
                        </Grid>
                        { person.getID() === project.owner ? (
                        <Grid item xs={4} align={"center"}>
                            <Button color='secondary' size='small' startIcon={<PersonRemoveRoundedIcon/>}
                                    onClick={this.deleteProjectMemberButtonClicked}> </Button>
                        </Grid>):
                        <Grid item xs={2}>
                        </Grid>}
                    </Grid>
                </ListItem>
                <Divider/>
                <ProjectMemberDeleteDialog show={showProjectMemberDeleteDialog} projectMember={projectMember} project={project}
                                      onClose={this.deleteProjectMemberDialogClosed}/>
            </div>
        );
    }


}


export default ProjectMemberListEntry;