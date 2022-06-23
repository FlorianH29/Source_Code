import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import PropTypes from "prop-types";
import {Box, Divider, Grid, Typography} from "@mui/material";
import ProjectListEntry from "./ProjectListEntry";
import ProjectAnalysisProjectEntry from "./ProjectAnalysisProjectEntry";

class ProjectAnalysis extends Component {

    constructor(props) {
        super(props);

    // den state initialisieren
    this.state = {
      startDate: null,
      endDate: null,
      workTimeProject: null,
      projects: [],
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

  /** Gibt die Projekte einer Person zurück, in denen sie Projektleiter ist.*/
  getProjects = () => {
    HdMWebAppAPI.getAPI().getProjectsByOwner()
        .then(projectBOs =>
            this.setState({
                projects: projectBOs
            })).catch(e =>
        this.setState({
            projects: []
        }));
        // console.log(this.state.projects)
  }

    componentDidMount() {
        this.getProjects();
    }

  render() {
      const {startDate, projects} = this.state
      console.log(this.state.projects)

      return(
          <div>
              <Box m={18} pl={8}>
                  <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                    Projekte: </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                    Klient: </Typography>
                            </Grid>
                            <Grid item xs={4} align={"center"}>
                                <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                    Arbeitsleistung: </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {projects.map(pro =>
                            <ProjectAnalysisProjectEntry key={pro.getID()} project={pro} />)}
                    </Grid>
                </Grid>
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