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
            arrived: ''
        };
    }


    /** Gibt die Arbeitsleistung für eine Aktivität in einen gegebenen Zeitraum zurück */
    getWorkTimeActivity = () => {
        console.log(this.props.startDate)
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

    /** Gibt zurück, ob das letzte Gehen einer Person größer ist als das letzte Kommen */
    getDepartureBiggerArrive = () => {
        HdMWebAppAPI.getAPI().getDepartureBiggerArrive()
            .then(value => this.setState({
                arrived: value,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    arrived: '',
                })
            );
    }

    componentDidMount() {
        this.getWorkTimeActivity();
        this.getDepartureBiggerArrive();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props != prevProps) {
            this.getWorkTimeActivity();
        }
    }

    secondsToString(seconds){
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        let totalMinutes = seconds/60>>0;
        let minutes = totalMinutes%60;
        let hours = totalMinutes/60>>0;
        return zeroPad(hours,2)+":"+zeroPad(minutes,2)
    }

    render() {
        const {activity, workTimeActivity} = this.state;

        console.log(this.state)
        return (
            <div style={{width: "100%", p: 0, m: 0}}>
                <Accordion sx={{width: "100%", p: 0, m: 0}}>
                    <AccordionSummary>
                        <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityName()}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"}>
                                    {activity.getActivityCapacity()}h
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
