import React, {Component} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Divider, Typography, withStyles} from '@material-ui/core';
import {Grid} from '@mui/material';
import ProjectAnalysisProjectWorkList from "./ProjectAnalysisProjectWorkList";
import {HdMWebAppAPI} from "../api";

class ProjectAnalysisActivityListEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: props.activity,
            workTimeActivity: '',
        };
    }


    /** Gibt die Arbeitsleistung für eine Aktivität in einen gegebenen Zeitraum zurück */
    getWorkTimeActivity = () => {
        if (this.props.activity.getID() > 0) {
            HdMWebAppAPI.getAPI().getActivityWorkTime(this.props.activity.getID(), this.props.startDate, this.props.endDate).then(workTimeActivity => this.setState({
                workTimeActivity: workTimeActivity,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    workTimeActivity: '',
                })
            );
        }
    }

    componentDidMount() {
        this.getWorkTimeActivity();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props != prevProps) {
            this.getWorkTimeActivity();
        }
    }

    secondsToString(seconds) {
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        let totalMinutes = seconds / 60 >> 0;
        let minutes = totalMinutes % 60;
        let hours = totalMinutes / 60 >> 0;
        return zeroPad(hours, 2) + ":" + zeroPad(minutes, 2)
    }

    render() {
        const { startDate, endDate} = this.props
        const {activity, workTimeActivity} = this.state;

        return (
            <div style={{width: "100%"}}>
                <Accordion sx={{width: "100%"}}>
                    <AccordionSummary>
                        <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityName()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityCapacity()} h
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {this.secondsToString(workTimeActivity)} h
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Divider/>
                        <ProjectAnalysisProjectWorkList activity={activity} startDate={startDate} endDate={endDate}>
                        </ProjectAnalysisProjectWorkList>
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

export default withStyles(styles)(ProjectAnalysisActivityListEntry);
