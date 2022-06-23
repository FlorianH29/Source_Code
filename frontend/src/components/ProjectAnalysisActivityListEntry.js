import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider} from '@material-ui/core';
import ProjectAnalysisProjectWorkList from "./ProjectAnalysisProjectWorkList";

class ActivityListEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: props.activity,
        };
    }

    render() {
        const {activity} = this.state;

        // console.log(this.state);
        return (
            <div style={{width: 1000}}>
                <Accordion sx={{width: 100}}>
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
                                    {activity.getActivityWorkTime()}  // hier dynamisch
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
