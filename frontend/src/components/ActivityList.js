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
    Dialog
} from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import ActivityForm from "./dialogs/ActivityForm";
import PropTypes from "prop-types";
import ActivityListEntry from "./ActivityListEntry";
import {Redirect, withRouter} from "react-router-dom";


class ActivityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            showActivityForm: false
        };
    };

    getActivitiesForProject() {
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

    componentDidMount() {
        if (this.props.location.pro) {
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
        const {activities, showActivityForm} = this.state;

         let pro = null;
         if (this.props.location.pro) {
            // owner object exists
            pro = this.props.location.pro
         } else {
           // ProjectBO existiert nicht, stattdessen wurde die Komponente direkt über die URL aufgerufen oder die Seite
           // wurde neu geladen -> zurück auf die Startseite verweisen
            return (<Redirect to='/' />);
         }

        return (
            <div>
                <Box m={18}  pl={8}>
                <Typography variant={"h4"} algin={"left"} component={"div"}>
                    Projekt: {this.props.projectName}
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
                        <ActivityListEntry key={ac.getID()} activity={ac} onActivityDeleted={this.activityDeleted}/>)
                    }
                    </Grid>
                </Grid>
                <ActivityForm onClose={this.activityFormClosed} show={showActivityForm}></ActivityForm>
                </Box>
            </div>
        )
    }
}


ActivityList.propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** The CustomerBO of this AccountList */
    project: PropTypes.object.isRequired,
    /** If true, accounts are (re)loaded */
    show: PropTypes.bool.isRequired,
}


ActivityForm.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default withRouter(ActivityList);