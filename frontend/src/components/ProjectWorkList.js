import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Button, Grid, Typography, Divider, Dialog, DialogActions, DialogContent, List, Collapse} from '@mui/material';
import Box from "@mui/material/Box";
import ProjectWorkListEntry from "./ProjectWorkListEntry";
import EventManager from "./EventManager";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {withRouter, Redirect} from "react-router-dom";

class ProjectWorkList extends Component {

  constructor(props) {
    super(props);

      this.state = {
        projectWorks: [],
        showProjectWorkForm: false,
        open: false,
        disableEnd: true,
        disableStart: false,
      }
  }

  getProjectWorksForActivity = () => {
    const { activity } = this.props.location.ac;

    this.setState({projectWorks: []});
    HdMWebAppAPI.getAPI().getProjectWorks(activity.getID())  // statt 1 sollte hier die Id der ausgewählten Aktivität rein
      .then(projectWorkBOs =>
        this.setState({
          projectWorks: projectWorkBOs
            })).catch(e =>
        this.setState({
            projectWorks: []
        }));
  }

  getWorkTimeActivity = () => {
     HdMWebAppAPI.getAPI().getActivityWorkTime(1, this.state.start, this.state.start)
        .then(workTimeProject => this.setState({
            workTimeProject: workTimeProject
      })).catch(e =>
        this.setState({ // bei Fehler den state zurücksetzen
          workTimeProject: null,
        })
      );
  }

  componentDidMount() {
      if (this.props.location.ac) {
          this.getProjectWorksForActivity();
      }
  }

  handleStartEventButtonClicked = (event) => {
    // Dialog öffnen, um damit ein Startevent anlegen zu können
      event.stopPropagation();
      this.setState({
          showProjectWorkForm: true
      })
  }

  handleEndEventButtonClicked = (event) => {
    // Dialog öffnen, um damit ein Endevent zu dem Startevent und somit eine Projektarbeit anlegen zu können
      event.stopPropagation();
      this.setState({
          open: true
      })
  }

  /** Behandelt das click event für den Button Abbrechen*/
  handleClose = () => {
    // den state neu setzen, sodass open false ist und der Dialog nicht mehr angezeigt wird
    this.setState({open: false});
  }

  refreshProjectWorkList = () => {
      this.getProjectWorksForActivity();
      this.setState({open: false});
  }

  /**
   * Behandelt onProjectWorkDeleted Events der ProjectWorkListEntry Komponente
   */
  projectWorkDeleted = projectWork => {
    const newProjectWorkList = this.state.projectWorks.filter(projectWorkFromState => projectWorkFromState.getID() !== projectWork.getID());
    this.setState({
      projectWorks: newProjectWorkList,
      showProjectWorkForm: false
    });
  }

  /** Behandelt das onClose Event von ProjectWorkForm */
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
    const { projectWorks, showProjectWorkForm, disableEnd, disableStart, open } = this.state;
    // console.log(this.state)
    let ac = null;
    if (this.props.location.ac) {
      // owner object exists
      ac = this.props.location.ac
    } else {
      // owner object does not exist, we are called directly by route URL
      // or the page has been refreshed -> put the user back to start page
      return (<Redirect to='/' />);
    }

    return (
        <div>
        <Box m={18}  pl={5}>
          <Grid container>
            <Grid item xs={12} align={"center"}>
                <Grid container>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Projektarbeit </Typography>
                    </Grid>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Bearbeiter </Typography>
                    </Grid>
                    <Grid item xs={3} align={"flex-end"}>
                        <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                    </Grid>
                </Grid>
                <Divider/>
                {projectWorks.map(pw =>
                    <ProjectWorkListEntry key={pw.getID()} projectWork={pw} onProjectWorkDeleted={this.projectWorkDeleted}/>)
                }
                <Grid container direction={'row'} spacing={18}>
                    <Grid item xs={4} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.handleStartEventButtonClicked}>
                            Start buchen
                        </Button>
                    </Grid>
                    <Grid item xs={4} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.handleEndEventButtonClicked}>
                            Ende buchen
                        </Button>
                    </Grid>
                    <Grid item xs={4} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.getWorkTimeActivity}>
                            Methode testen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
            <Dialog open={open} onClose={this.handleClose}>
                <DialogTitle>Ende buchen
                    <IconButton onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ende buchen und Projektarbeit beenden?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color='secondary'>
                        Abbrechen
                    </Button>
                    <EventManager eventType={2} onClose={this.refreshProjectWorkList}>
                    </EventManager>
                </DialogActions>
            </Dialog>
            </Box>
            <ProjectWorkForm onClose={this.projectWorkFormClosed} show={showProjectWorkForm}></ProjectWorkForm>
        </div>
        );
    }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(1),
  },
  subNav: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  tableHeader: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
  }
});

/** PropTypes */
ProjectWorkForm.propTypes = {

  onClose: PropTypes.func.isRequired,

}

export default withRouter(ProjectWorkList);