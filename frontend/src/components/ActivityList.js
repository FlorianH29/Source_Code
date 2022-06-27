import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import {Button, Grid, Typography, Divider, Box, Link, Card} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ActivityForm from "./dialogs/ActivityForm";
import ActivityListEntry from "./ActivityListEntry";
import ProjectMemberList from "./ProjectMemberList";
import {Link as RouterLink, Redirect, withRouter} from "react-router-dom";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";


class ActivityList extends Component {

    constructor(props) {
        super(props);

        let expandedID = null;
        let expandedName = null;

        if (this.props.location.expandedProject) {
            expandedID = this.props.location.expandedProject.project.getID();
            expandedName = this.props.location.expandedProject.project.getProjectName();
        }

        this.state = {
            activities: [],
            showActivityForm: false,
            disableButton: null,
            expandedProjectID: expandedID,
            expandedProjectName: expandedName,
        };
    };


    /** Ermittelt, ob der Aktivität erstellen Knopf gedrückt werden darf oder nicht, wenn die das Programm bedienende
     * Person nicht Leiter des Projekts ist, ist er ausgegraut. */
    handleDisableButton = () => {
        if (this.props.location.per) {
            if (this.props.location.per.person.id === this.props.location.pro.project.owner) {
                this.setState({
                    disableButton: false
                })
            } else {
                this.setState({
                    disableButton: true
                })
            }
        }
        // wenn auf der Projektarbeitenliste Zurück geklickt wurde, die von dort zurückgegebenen Werte vergleichen
        else if (this.props.location.expandedPerson) {
            if (this.props.location.expandedPerson.person.id === this.props.location.expandedProject.project.owner) {
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

    getActivitiesForProject() {
        if (this.props.location.pro) {
            const {project} = this.props.location.pro
            HdMWebAppAPI.getAPI().getActivities(project.getID())
                .then(activityBOs =>
                    this.setState({
                        activities: activityBOs
                    })).catch(e =>
                this.setState({
                    activities: []
                }));
        } else if (this.props.location.expandedProject) {
            HdMWebAppAPI.getAPI().getActivities(this.state.expandedProjectID)
                .then(activityBOs =>
                    this.setState({
                        activities: activityBOs
                    })).catch(e =>
                this.setState({
                    activities: []
                }));
        }
    }

    componentDidMount() {
        if (this.props.location.pro) {
            this.getActivitiesForProject();
            this.handleDisableButton();
        }
        else if (this.props.location.expandedProject) {
            this.getActivitiesForProject();
            this.handleDisableButton();
        }
    }

    handleAddActivityButtonClicked = (event) => {
        // Dialog öffnen, um damit eine Aktivität anlegen zu können
        event.stopPropagation();
        this.setState({
            showActivityForm: true
        })
    }

    activityDeleted = activity => {
        const newActivityList = this.state.activities.filter(activityFromState => activityFromState.getID() !== activity.getID());
        this.setState({
            activities: newActivityList,
            showActivityForm: false
        });
    }

    /** Behandelt das onClose Event von ActivityForm */
    activityFormClosed = activity => {
        // projectWork ist nicht null und deshalb erstelltI/überarbeitet
        if (activity) {
            const newActivityList = [...this.state.activities, activity];
            this.setState({
                activities: newActivityList,
                showActivityForm: false
            });
        } else {
            this.setState({
                showActivityForm: false
            });
        }
    }

    render() {
        const {activities, showActivityForm, expandedProjectID, expandedProjectName, disableButton} = this.state;
        //console.log(this.props.location.pro)

        let pro = null;
        let projectName = null;
        if (this.props.location.pro) {
            // ProjectBo existiert
            pro = this.props.location.pro;
            projectName = pro.project.getProjectName()
        } else if (expandedProjectID) {
            // in Projektarbeitsliste wurde Zurück geklickt
            pro = this.props.location.expandedProject
            projectName = expandedProjectName
        } else {
            // ProjectBO existiert nicht, stattdessen wurde die Komponente direkt über die URL aufgerufen oder die Seite
            // wurde neu geladen -> zurück auf die Startseite verweisen
            return (<Redirect to='/'/>);
        }

         //console.log(pro.project)

         let per = null;
         if (this.props.location.per) {
            // PersonBO existiert
            per = this.props.location.per;
         } else if (this.props.location.expandedPerson){
             console.log(this.props.location.expandedPerson)
            // in Projektarbeitsliste wurde Zurück geklickt
            per = this.props.location.expandedPerson
        }

        return (
            <div>
                <Box mt={18} ml={22} mr={5} mb={10} pl={8}>
                    <Card>
                    <Typography component='div' color={"primary"}>
                        <Link component={RouterLink} to={{
                            pathname: '/projects'
                        }}>
                            <Grid container spacing={1} justify='flex-start' alignItems='stretch'>
                                <Grid item>
                                    <ArrowCircleLeftRoundedIcon color={"primary"}/>
                                </Grid>
                                <Grid item> zurück zur Projektübersicht
                                </Grid>
                            </Grid>
                        </Link>
                    </Typography>
                        <Grid container mt={2}  alignItems='stretch' spacing={1}>
                            <Grid item md={3}/>
                            <Grid item md={5} align={"center"}>
                                <Typography variant={"h4"} algin={"center"} component={"div"}>
                                    Projekt: {projectName}
                                </Typography>
                            </Grid>
                            <Grid item md={4} align={"right"}>
                                <Button disabled={disableButton} variant='contained' align={"center"} color='primary' startIcon={<AddIcon/>}
                                onClick={this.handleAddActivityButtonClicked}>
                                    Aktivität anlegen
                                </Button>
                            </Grid>
                        </Grid>

                    <Grid container mt={4}>
                        <Grid item md={12} align={"center"}>
                            <Grid container>
                                <Grid item md={4} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Aktivitäten </Typography>
                                </Grid>
                                <Grid item md={4} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Kapazität </Typography>
                                </Grid>
                                <Grid item md={4} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                                </Grid>

                            </Grid>
                            <Divider/>
                            {activities.map(ac =>
                                <ActivityListEntry key={ac.getID()} activity={ac} project={pro.project}
                                                   person={per.person}
                                                   onActivityDeleted={this.activityDeleted}/>)
                            }
                        </Grid>
                    </Grid>
                <ActivityForm onClose={this.activityFormClosed} show={showActivityForm} project={pro.project}></ActivityForm>
                        </Card>
                </Box>
                <ProjectMemberList project={pro.project} show={ProjectMemberList}></ProjectMemberList>
            </div>
        )
    }
}


export default withRouter(ActivityList);