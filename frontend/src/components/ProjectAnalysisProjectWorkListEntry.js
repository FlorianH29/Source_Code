import React, {Component} from 'react';
import {Divider, Typography, withStyles} from '@material-ui/core';
import {Grid} from '@mui/material';
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
      event: null
    };
  }

  componentDidMount() {
    this.getProjectWorkOwner();
    this.getEvent();
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

  /** Gibt das Start Event der Projektarbeit zurück */
  getEvent = () => {
    if (this.props.projectWork.getID() > 0) {
      HdMWebAppAPI.getAPI().getEventByProjectWork(this.props.projectWork.getID()).then(event =>
      this.setState({
        event: event,
      })).catch(e =>
        this.setState({ // bei Fehler den state zurücksetzen
          event: null,
        })
      );}
  }

  timedeltaToTimeFormat(timedelta){
      if (timedelta != null) {
          const timeSplits = timedelta.split(":");
          const zeroPad = (num, places) => String(num).padStart(places, '0')
          return zeroPad(timeSplits[0],2) + ":" + zeroPad(timeSplits[1],2)
      }
  }

  /** Renders the component */
  render() {
    const { projectWork, owner, event } = this.state;

    let projectWorkOwnerFN = '';
    let projectWorkOwnerLN = '';
    if (owner) {
        projectWorkOwnerFN = owner.firstname;
        projectWorkOwnerLN = owner.lastname;
    }

    let timeStamp = '';
    if (event !== null) {
        timeStamp = event[0].getTimeStamp()
    }

    return (
        <div style={ {width: "100%", p: 0, m:0}}>
            <Grid container alignItems='center' spacing={2} p={1}>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {projectWork.getProjectWorkName()}
                    </Typography>
                </Grid>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {projectWorkOwnerFN} {projectWorkOwnerLN}
                    </Typography>
                </Grid>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {new Date(timeStamp).toLocaleString('de-DE', {
                                dateStyle: "long"})}
                    </Typography>
                </Grid>
                <Grid item xs={3} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {this.timedeltaToTimeFormat(projectWork.getTimeIPeriod())} h
                    </Typography>
                </Grid>
            </Grid>
            <Divider/>
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