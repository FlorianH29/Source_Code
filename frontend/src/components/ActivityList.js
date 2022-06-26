import React, {Component} from 'react';
import {ActivityBO, HdMWebAppAPI} from "../api";
import {
    withStyles,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    Typography,
    Divider,
    Box,
    DialogContent,
    DialogActions,
    Dialog, Link, Card
} from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import ActivityForm from "./dialogs/ActivityForm";
import PropTypes from "prop-types";
import ActivityListEntry from "./ActivityListEntry";
import ProjectMemberList from "./ProjectMemberList";
import {spacing} from '@mui/system'
import ProjectMemberListEntry from "./ProjectMemberListEntry";
import {Link as RouterLink, Redirect, withRouter} from "react-router-dom";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";


class ActivityList extends Component {

    constructor(props) {
        super(props);

        let expandedID = null;
         let expandedName = null;

        if (this.props.location.expandedProject) {
            expandedID = this.props.location.expandedProject.getID();
            expandedName = this.props.location.expandedProject.getProjectName();
        }
        console.log(this.props.location.expandedProject)

        this.state = {
            activities: [],
            showActivityForm: false,
            expandedProjectID: expandedID,
            expandedProjectName: expandedName,
        };
    };

    getActivitiesForProject() {
        if (this.props.location.pro) {
            const { project } = this.props.location.pro
            HdMWebAppAPI.getAPI().getActivities(project.getID())
            .then(activityBOs =>
                this.setState({
                    activities: activityBOs
                })).catch(e =>
            this.setState({
                activities: []
            }));
        }
        else if (this.props.location.expandedProject) {
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
        }
        else if (this.props.location.expandedProject) {
            this.getActivitiesForProject();
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

    /** Behandelt das onClose Event von CustomerForm */
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
        const {classes} = this.props;
        const {activities, showActivityForm, expandedProjectID, expandedProjectName } = this.state;

         let pro = null;
         let projectName = null;
         if (this.props.location.pro) {
            // ProjectBo existiert
            pro = this.props.location.pro;
            projectName = pro.project.getProjectName()
         } else if (expandedProjectID){
            // in Projektarbeitsliste wurde Zurück geklickt
            pro = this.props.location.expandedProject
            projectName = expandedProjectName
        }
         else {
           // ProjectBO existiert nicht, stattdessen wurde die Komponente direkt über die URL aufgerufen oder die Seite
           // wurde neu geladen -> zurück auf die Startseite verweisen
            return (<Redirect to='/' />);
         }

         let per = null
         if (this.props.location.per){
             per = this.props.location.per
         }

        return (
            <div>
                <Box m={18}  pl={8}>
                    <Card>
                    <Typography component='div' color={"primary"}>
                        <Link component={RouterLink} to={{
                            pathname: '/projects'}}>
                            <Grid container spacing={1} justify='flex-start' alignItems='stretch'>
                                <Grid item>
                                    <ArrowCircleLeftRoundedIcon color={"primary"}/>
                                </Grid>
                                <Grid item> zurück
                                </Grid>
                            </Grid>
                        </Link>
                    </Typography>
                    <Typography variant={"h4"} algin={"left"} component={"div"}>
                        Projekt: {projectName}
                    </Typography>
                    <Button variant='contained' color='primary' startIcon={<AddIcon/>}
                        onClick={this.handleAddActivityButtonClicked}>
                        Aktivität anlegen
                    </Button>
                    <Grid container mt={1}>
                        <Grid item xs={12} align={"center"}>
                            <Grid container>
                                <Grid item xs={3} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Aktivitäten </Typography>
                                </Grid>
                                <Grid item xs={3} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Kapazität </Typography>
                                </Grid>
                                <Grid item xs={3} align={"flex-end"}>
                                    <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                                </Grid>
                            </Grid>
                            <Divider/>
                            {activities.map(ac =>
                                <ActivityListEntry key={ac.getID()} activity={ac} project={pro.project} person={per.person}
                                                   onActivityDeleted={this.activityDeleted}/>)
                            }
                        </Grid>
                    </Grid>
                <ActivityForm onClose={this.activityFormClosed} show={showActivityForm}></ActivityForm>
                        </Card>
                </Box>
                <ProjectMemberList> show={ProjectMemberList} project = {this.props.project} </ProjectMemberList>
            </div>
        )
    }
}


/*ActivityList.propTypes = {
    /** @ignore *//*
    classes: PropTypes.object.isRequired,
    /** The CustomerBO of this AccountList *//*
    project: PropTypes.object.isRequired,
    /** If true, accounts are (re)loaded *//*
    show: PropTypes.bool.isRequired,
}*/


ActivityForm.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default withRouter(ActivityList);