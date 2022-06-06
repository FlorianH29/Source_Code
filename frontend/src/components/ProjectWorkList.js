import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ProjectWorkEntry from "./ProjectWorkListEntry";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import PropTypes from "prop-types";

class ProjectWorkList extends Component {

  constructor(props) {
    super(props);

      this.state = {
        projectWorks: [],
        showProjectWorkForm: false
      }
  }

  getProjectWorksForActivity = () => {
    HdMWebAppAPI.getAPI().getProjectWorks(1)  // statt 1 sollte hier die Id der ausgewählten Aktivität rein
      .then(projectWorkBOs =>
        this.setState({
          projectWorks: projectWorkBOs
            })).catch(e =>
        this.setState({
            projectWorks: []
        }));
  }

  componentDidMount() {
    this.getProjectWorksForActivity();
  }

  handleStartEventButtonClicked = (event) => {
    // Dialog öffnen, um damit ein Startevent und eine Projektarbeit anlegen zu können
      event.stopPropagation();
      this.setState({
          showProjectWorkForm: true
      })
  }

  handleEndEventButtonClicked() {
    // anlegen eines Endevents zu erstelltem Startevent
  }

  /**
   * Behandelt onProjectWorkDeleted Events der CustomerListEntry Komponente
   */
  projectWorkDeleted = projectWork => {
    const newProjectWorkList = this.state.projectWorks.filter(projectWorkFromState => projectWorkFromState.getID() !== projectWork.getID());
    this.setState({
      projectWorks: newProjectWorkList,
      showProjectWorkForm: false
    });
  }

  /** Behandelt das onClose Event von CustomerForm */
  projectWorkFormClosed = projectWork => {
    // projectWork ist nicht null und deshalb erstelltI/überarbeitet
    if (projectWork) {
      const newProjectWorksList = [...this.state.projectWorks, projectWork];
      this.setState({
        projectWorks: newProjectWorksList,
        showProjectWorkForm: false
      });
    } else {
        this.setState({
          showProjectWorkForm: false
        });
      }
  }

  render() {
    const { classes } = this.props;
    const { projectWorks, showProjectWorkForm } = this.state;
    console.log(this.state)

    return (
        <div>
          <Grid container>
            <Grid item xs={12} align={"center"}>
                <Grid container>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Projektarbeit </Typography>
                    </Grid>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Beschreibung </Typography>
                    </Grid>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                    </Grid>
                </Grid>
                <Divider/>
                {projectWorks.map(pw =>
                    <ProjectWorkEntry key={pw.getID()} projectWork={pw} onProjectWorkDeleted={this.projectWorkDeleted}/>)
                }
                <Grid container direction={'row'} spacing={18}>
                    <Grid item xs={6} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.handleStartEventButtonClicked}>
                            Start buchen
                        </Button>
                    </Grid>
                    <Grid item xs={6} align={'center'}>
                        <Button variant='contained' color='primary' disabled={true} onClick={this.handleEndEventButtonClicked}>
                            Ende buchen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
            <ProjectWorkForm onClose={this.projectWorkFormClosed} show={showProjectWorkForm}></ProjectWorkForm>
        </div>
        );
    }
}

export default ProjectWorkList;