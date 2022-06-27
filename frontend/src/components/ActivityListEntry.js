import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Grid, Typography} from '@material-ui/core';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ActivityDeleteDialog from "./dialogs/ActivityDeleteDialog";
import ActivityForm from "./dialogs/ActivityForm";
import {Link as RouterLink, withRouter} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";

/**
 * Rendert ein ActivityBO innerhalb eines auf- und zuklappbaren ActivityListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes ActivityBO manipuliert werden kann.
 */

class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            activity: props.activity,
            showActivityForm: false,
            showActivityDeleteDialog: false,
        };
    }

    /** Behandelt das onClick Event des Activity bearbeiten Buttons */
    editActivityButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showActivityForm: true
        });
    }

    /** Behandelt das onClose Event von ActivityForm */
    activityFormClosed = (activity) => {
        // activity ist nicht null und wurde dementsprechend geändert
        if (activity) {
            this.setState({
                activity: activity,
                showActivityForm: false
            });
        } else {
            this.setState({
                showActivityForm: false
            });
        }
    }

    /** Behandelt das onClose Event von ActivityDeleteDialog*/
    deleteActivityDialogClosed = (activity) => {
        if (activity) {
            this.props.onActivityDeleted(activity);
        }
        this.setState({
            showActivityDeleteDialog: false // Den Dialog nicht mehr anzeigen
        });
    }

    /** Behandelt das onClick Event des Activity löschen Buttons */
    deleteActivityButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showActivityDeleteDialog: true
        });
    }

    /** Rendert die Componente*/
    render() {
        const {project, person} = this.props;
        const {activity, showActivityForm, showActivityDeleteDialog} = this.state;

        // console.log(this.state);
        return (
            <div>
                <ListItem>
                    <Grid container alignItems='center'>
                        <Grid item xs={3} align={"center"}>
                            <ListItemButton component={RouterLink} to={{
                                pathname: `/projectworks`,
                                owner: {
                                    activity: activity,
                                    project: project
                                },
                                per: {
                                    person: person
                                }
                            }}>

                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityName()}
                                </Typography>
                            </ListItemButton>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {activity.getActivityCapacity()} h
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {activity.getActivityWorkTime()} h
                            </Typography>
                        </Grid>
                        {person.getID() === project.owner ? (
                                <Grid item xs={3} align={"center"}>
                                    <Button color='primary' size='small' startIcon={<EditIcon/>}
                                            onClick={this.editActivityButtonClicked}> </Button>
                                    <Button color='secondary' size='small' startIcon={<RemoveCircleOutlineRoundedIcon/>}
                                            onClick={this.deleteActivityButtonClicked}> </Button>
                                </Grid>
                            ) :
                            <Grid xs align={"center"}>
                            </Grid>}
                    </Grid>
                </ListItem>
                <Divider/>
                <ActivityDeleteDialog show={showActivityDeleteDialog} activity={activity}
                                      onClose={this.deleteActivityDialogClosed}/>
                <ActivityForm show={showActivityForm} activity={activity} onClose={this.activityFormClosed}/>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        width: '100%',
    },
});


export default withRouter(ActivityListEntry);
