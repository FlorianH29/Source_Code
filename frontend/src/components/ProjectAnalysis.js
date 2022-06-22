import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";

class ProjectAnalysis extends Component {

    constructor(props) {
        super(props);

    // den state initialisieren
    this.state = {
      startDate: null,
      endDate: null,
      workTimeProject: null,
      showProjectWorkForm: false,
      showProjectWorkDeleteDialog: false,
    };

    }

  /** Gibt die Arbeitsleistung für ein Project in einen gegebenen Zeitraum zurück */
  getWorkTimeProject = () => {
    if (this.props.project.getID() > 0) {
      HdMWebAppAPI.getAPI().getProjectWorkTime(this.props.project.getID(), this.state.startDate, this.state.endDate).
      then(workTimeProject => this.setState({
        workTimeProject: workTimeProject,
      })).catch(e =>
        this.setState({ // bei Fehler den state zurücksetzen
          workTimeProject: null,
        })
      );}
  }

  /** Gibt die Arbeitsleistung für eine Aktivität in einen gegebenen Zeitraum zurück */
  getWorkTimeActivity = () => {
    if (this.props.activity.getID() > 0) {
      HdMWebAppAPI.getAPI().getActivityWorkTime(this.props.activity.getID(), this.state.startDate, this.state.endDate).
      then(workTimeProject => this.setState({
        workTimeProject: workTimeProject,
      })).catch(e =>
        this.setState({ // bei Fehler den state zurücksetzen
          workTimeProject: null,
        })
      );}
  }

  render() {
      const {startDate} = this.state

      return(
          <div>
              <Box m={18} pl={8}>
              <Typography>
                  TEST
              </Typography>
              </Box>
          </div>
      );
  }
}

/** PropTypes */
ProjectAnalysis.propTypes = {
    /** Das ProjectBO welches gerendert werden soll */
    project: PropTypes.object.isRequired,
    /** Das ActivityBO welches gerendert werden soll */
    activity: PropTypes.object.isRequired,
}

export default ProjectAnalysis;