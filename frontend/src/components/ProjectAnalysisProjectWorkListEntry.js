import React, {Component} from 'react';
import {Grid, Typography, withStyles} from '@material-ui/core';
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

  timedeltaToTimeFormat(timedelta){
      const timeSplits = timedelta.split(":");
      const zeroPad = (num, places) => String(num).padStart(places, '0')
      return zeroPad(timeSplits[0],2) + ":" + zeroPad(timeSplits[1],2)
  }

  /** Renders the component */
  render() {
    const { projectWork, owner } = this.state;
    return (
        <div style={ {width: "100%", p: 0, m:0}}>
            <Grid container alignItems='center' spacing={2}>
                <Grid item xs={4} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {projectWork.getProjectWorkName()}
                    </Typography>
                </Grid>
                <Grid item xs={4} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {owner.firstname} {owner.lastname}
                    </Typography>
                </Grid>
                <Grid item xs={4} align={"center"}>
                    <Typography variant={"h5"} component={"div"}>
                        {
                        this.timedeltaToTimeFormat(projectWork.getTimeIPeriod())} h
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