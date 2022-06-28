import React, {Component} from 'react';
import {Button} from '@material-ui/core';
import {HdMWebAppAPI} from '../api';
import {Box, Card, Divider, Grid, Typography} from "@mui/material";
import ProjectMemberListEntry from "./ProjectMemberListEntry";
import CheckboxForm from "./dialogs/CheckboxForm";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';


class ProjectMemberList extends Component {

    constructor(props) {
        super(props);

        // Den State initiieren
        this.state = {
            projectMembers: [],
            potentialProjectMembers: [],
            showCheckboxForm: false,
            disableButton: ''
        };
        //console.log(this.props.project)
    }

    getProjectMembersOfProject = () => {
        this.setState({projectMembers: []}, () => {
            HdMWebAppAPI.getAPI().getProjectMembers(this.props.project.getID())
                .then(personBOs =>
                    this.setState({
                        projectMembers: personBOs
                    })).catch(e =>
                this.setState({
                    projectMembers: []
                }));
        });
    }

    /** Ermittelt, ob der Aktivität erstellen Knopf gedrückt werden darf oder nicht, wenn die das Programm bedienende
     * Person nicht Leiter des Projekts ist, ist er ausgegraut. */
    handleDisableButton = () => {
        if (this.props.person) {
            if (this.props.person.id === this.props.project.owner) {
                this.setState({
                    disableButton: false
                })
            } else {
                this.setState({
                    disableButton: true
                })
            }
        }
    }

    componentDidMount() {
        this.getProjectMembersOfProject();
        this.handleDisableButton();
    }

    getPotentialMembersForProject = () => {
        this.setState({potentialProjectMembers: []}, () => {
            HdMWebAppAPI.getAPI().getPersonsNotProjectMembersOfProject(this.props.project.getID())
                .then(personBOs => {
                    this.setState({
                        potentialProjectMembers: personBOs
                    })
                }).catch(e =>
                this.setState({
                    potentialProjectMembers: []
                }));
        });
    }

    handleAddProjectMemberButtonClicked = (event) => {
        // Dialog öffnen, um damit eine Aktivität anlegen zu können
        event.stopPropagation();
        this.setState({
            showCheckboxForm: true
        });
    }

    projectMemberDeleted = projectMember => {
        const newProjectMemberList = this.state.projectMembers.filter(projectMemberFromState => projectMemberFromState.getID() !== projectMember.getID());
        this.setState({
            activities: newProjectMemberList,
            showCheckboxForm: false //Fom Mitarbeiter hinzuufügen muss Theoretisch von Jannik kommen.
        });
    }

    checkboxFormClosed = () => {
        // projectMember ist nicht null und deshalb erstellt/überarbeitet

            this.setState({
                showCheckboxForm: false
            });
            this.getProjectMembersOfProject();
        }


    render() {
        const {project, person} = this.props;
        const {projectMembers, showCheckboxForm, onProjectMemberDeleted, disableButton} = this.state;


        return (
            <div>
                <Box mt={3} ml={21} mr={50} mb={2} pl={8}>
                    <Card>
                        <Grid container p={1} alignItems='stretch' spacing={1}>
                            <Grid item xs={8}>
                                <Typography variant={"h1"} algin={"left"} component={"div"} fontWeight={'bold'}>
                                    Projektmitglieder
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"right"}>
                                <Button disabled={disableButton} size="large" color='primary' startIcon={<AddCircleOutlinedIcon/>}
                                        algin={"center"}
                                        onClick={this.handleAddProjectMemberButtonClicked}>
                                    Mitarbeiter
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} align={"center"} pt={3}>
                            <Grid container>
                                <Grid item xs={4} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Vorname </Typography>
                                </Grid>
                                <Grid item xs={4} align={"flex-end"}>
                                    <Typography variant={"h2"} component={"div"}> Nachname </Typography>
                                </Grid>
                            </Grid>

                            <Divider/>
                            {projectMembers.map(pm =>
                                <ProjectMemberListEntry key={pm.getID()} projectMember={pm} project={project} person={person}
                                                        onProjectMemberDeleted={this.projectMemberDeleted}
                                                        getProjectMembersOfProject={this.getProjectMembersOfProject}/>)
                            }
                        </Grid>
                        <CheckboxForm onClose={this.checkboxFormClosed} show={showCheckboxForm} project={project}
                                      getProjectMembersOfProject={this.getProjectMembersOfProject}
                                      getPotentialMembersForProject={this.getPotentialMembersForProject}
                                      potentialProjectMembers={this.state.potentialProjectMembers}></CheckboxForm>
                    </Card>
                </Box>
            </div>
        )
    }


}

export default ProjectMemberList;