import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Button, Grid, Typography, Divider, Dialog, DialogActions, DialogContent, List, Collapse} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ProjectWorkListEntry from "./ProjectWorkListEntry";
import EventManager from "./EventManager";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import ListItemButton from "@mui/material/ListItemButton";
//import BasicButtons from "./BasicButtons";

class ProjectWorkList extends Component {

  constructor(props) {
    super(props);

      this.state = {
        projectWorks: [],
        showProjectWorkForm: false,
        open: false,
        disableEnd: true,
        disableStart: false
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
                    <Grid item xs={6} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.handleStartEventButtonClicked}>
                            Start buchen
                        </Button>
                    </Grid>
                    <Grid item xs={6} align={'center'}>
                        <Button variant='contained' color='primary' onClick={this.handleEndEventButtonClicked}>
                            Ende buchen
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
                    <EventManager eventType={2} onClose={this.handleClose}>
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

export default ProjectWorkList;