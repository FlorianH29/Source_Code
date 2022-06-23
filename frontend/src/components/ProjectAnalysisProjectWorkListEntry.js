import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Divider} from '@material-ui/core';
import {HdMWebAppAPI} from "../api";


/**
 * Rendert ein ProjectWorkBO innerhalb eines auf- und zuklappbaren ProjectWorkListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes ProjektWorkBO manipuliert werden kann.
 */

class ProjectAnalysisProjectWorkListEntry extends Component {

  constructor(props) {
    super(props);

    // den state initialisieren
    this.state = {
      projectWork: this.props.projectWork,
      owner: '',
    };
  }

  componentDidMount() {
    this.getProjectWorkOwner();
  }

  /** Gibt den Ersteller einer Projektarbeit zurück */
  getProjectWorkOwner = () => {
    if (this.props.projectWork.getID() > 0) {
      HdMWebAppAPI.getAPI().getOwnerOfProjectWork(this.props.projectWork.getID()).then(owner =>
      this.setState({
        owner: owner,
      })).catch(e =>
        this.setState({ // bei Fehler den state zurücksetzen
          owner: null,
        })
      );}
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { projectWork, owner } = this.state;

    // console.log(this.state);
    return (
        <div>
            <Grid container alignItems='center'>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {projectWork.getProjectWorkName()}
                    </Typography>
                </Grid>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {owner.firstname} {owner.lastname}
                    </Typography>
                </Grid>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                    {projectWork.getTimeIPeriod()}
                    </Typography>
                </Grid>
            </Grid>
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
});


export default withStyles(styles)(ProjectAnalysisProjectWorkListEntry);