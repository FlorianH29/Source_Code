import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider, ListItemSecondaryAction } from '@material-ui/core';
import {ListItem} from "@mui/material";


/**
 * Rendert ein ProjectBO innerhalb eines Eintrags der ProjectListe
 * In Zukunft theoretisch Funkionen zur Manipulationmeinzelner ProjectBO´s
 */


class ProjectListEntry extends Component {

    constructor(props) {
        super(props);

        //Zunächst den State initialisieren

        this.state = {
            projects: props.projects,

        }
    }

    render() {
        const { classes } = this.props;
        const { projects } = this.state;

        console.log(projects)
        console.log (classes)

        return(
            <div>
                <ListItem>
                    <Grid container alignItems={"center"}   >
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {projects.getProjectName()}
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
            </div>
        );
    }
}