import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider} from '@material-ui/core';
import ProjectAnalysisProjectWorkList from "./ProjectAnalysisProjectWorkList";
import {HdMWebAppAPI} from "../api";

class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: props.activity,
            workTimeActivity: '',
        };
    }


    /** Gibt die Arbeitsleistung für eine Aktivität in einen gegebenen Zeitraum zurück */
    getWorkTimeActivity = () => {
        console.log(this.props.activity.getID())
        if (this.props.activity.getID() > 0) {
            HdMWebAppAPI.getAPI().getActivityWorkTime(this.props.activity.getID, this.props.startDate, this.props.endDate).then(workTimeActivity => this.setState({
                workTimeActivity: workTimeActivity,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    workTimeActivity: '',
                })
            );
        }
        console.log()
    }
    componentDidMount() {
        this.getWorkTimeActivity()
    }

    render() {
        const {activity, workTimeActivity} = this.state;

         console.log(workTimeActivity);
        return (
            <div style={{width: "100%", p: 0, m: 0}}>
                <Accordion sx={{width: "100%", p: 0, m: 0}}>
                    <AccordionSummary>
                        <Grid container alignItems='center'>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityName()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityCapacity()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                   {workTimeActivity} // hier dynamisch
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ProjectAnalysisProjectWorkList activity={activity}></ProjectAnalysisProjectWorkList>
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        width: '100%',
    },
});

export default withStyles(styles)(ActivityListEntry);
