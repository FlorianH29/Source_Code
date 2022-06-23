import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography,} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear'
import {withRouter} from 'react-router-dom';
import {PersonBO, HdMWebAppAPI} from '../api';
import CloseIcon from "@material-ui/icons/Close";
import {Box, Button, Divider} from "@mui/material";
import ProjectMemberListEntry from "./ProjectMemberListEntry";
import Card from "@mui/material/Card";
import ProjectMemberForm from "./dialogs/ProjectMemberForm";


class ProjectMemberList extends Component {

    constructor(props) {
        super(props);

        // Den State initiieren
        this.state = {
            projectMembers: [],
            showProjectMemberForm: false
        };
    }

    getProjectMembersOfProject = () => {
        HdMWebAppAPI.getAPI().getProjectMembers(1)  // statt 1 sollte hier die Id der ausgewählten Person rein
            .then(personBOs =>
                this.setState({
                    projectMembers: personBOs
                })).catch(e =>
            this.setState({
                projectMembers: []
            }));
    }

    componentDidMount() {
        this.getProjectMembersOfProject();
        //console.log(this.state)
    }

     handleAddProjectMemberButtonClicked = (event) => {
        // Dialog öffnen, um damit eine Aktivität anlegen zu können
        event.stopPropagation();
        this.setState({
            showProjectMemberForm: true
        })
    }

    projectMemberDeleted = projectMember => {
        const newProjectMemberList = this.state.projectMembers.filter(projectMemberFromState => projectMemberFromState.getID() !== projectMember.getID());
        this.setState({
            activities: newProjectMemberList,
            showProjectMemberForm: false //Fom Mitarbeiter hinzuufügen muss Theoretisch von Jannik kommen.
        });
    }

    render() {
        const {classes} = this.props;
        const {projectMembers} = this.state;
        //console.log(projectMembers)

        return (
            <div>
                <Box m={25}>
                    <Card>
                        <Grid item xs={12}>
                            <Typography variant={"h5"} algin={"left"} component={"div"}>
                                Projektmitglieder
                            </Typography>
                            <Button variant='contained' color='primary' startIcon={<AddIcon/>} algin={"center"}
                                        onClick={this.handleAddProjectMemberButtonClicked}>
                                    Mitarbeiter Hinzufühen
                            </Button>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} align={"center"}>
                                <Grid container>
                                    <Grid item xs={2} align={"flex-end"}>
                                        <Typography variant={"h5"} component={"div"}> Vorname </Typography>
                                    </Grid>
                                    <Grid item xs={2} align={"flex-end"}>
                                        <Typography variant={"h5"} component={"div"}> Nachname </Typography>
                                    </Grid>
                                </Grid>
                                <Divider/>
                                {projectMembers.map(pm =>
                                    <ProjectMemberListEntry key={pm.getID()} projectMember={pm}
                                                            onActivityDeleted={this.projectMemberDeleted}/>)
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </div>
        )
    }


}

export default ProjectMemberList;