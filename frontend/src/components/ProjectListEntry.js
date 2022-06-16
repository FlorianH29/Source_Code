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
            project: props.project

        }
    }

    render() {
        const { classes } = this.props;
        const { project } = this.state;

        //console.log(projects)
        //console.log (classes)

        return(
            <div>
                <ListItem>
                    <Grid container alignItems={"center"}>
                        <Grid item xs={3} align={"center"}>
                            <Typography variant={"h5"} component={"div"}>
                                {project.getProjectName()}
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
            </div>
        );
    }
}
/** Kompontenen spezifische Styles*/
const styles = theme => ({
  root: {
    width: '100%',
  },
});

/** PropTypes */
ProjectListEntry.propTypes = {
  /** Das ProjectBO welches gerendert werden soll */
  project: PropTypes.object.isRequired,


}

export default withStyles(styles)(ProjectListEntry);