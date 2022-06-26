import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import {Button, Dialog, DialogActions, DialogContent, Divider, Grid, Link, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import ProjectWorkListEntry from "./ProjectWorkListEntry";
import EventManager from "./EventManager";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import PropTypes from "prop-types";
import {DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import CloseIcon from "@material-ui/icons/Close";
import {Link as RouterLink, Redirect, withRouter} from "react-router-dom";

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
        const {activity} = this.props.location.owner;

        this.setState({projectWorks: []});
        HdMWebAppAPI.getAPI().getProjectWorks(activity.getID())
            .then(projectWorkBOs =>
                this.setState({
                    projectWorks: projectWorkBOs
                })).catch(e =>
            this.setState({
                projectWorks: []
            }));
    }

    componentDidMount() {
        if (this.props.location.owner) {
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
    const { projectWorks, showProjectWorkForm, disableEnd, disableStart, open } = this.state;
    // console.log(this.state)
    let owner = null;
    if (this.props.location.owner) {
      // AktivityBO existiert
      owner = this.props.location.owner
    } else {
      // AktivityBO existiert nicht, stattdessen wurde die Komponente direkt über die URL aufgerufen oder die Seite
      // wurde neu geladen -> zurück auf die Startseite verweisen
      return (<Redirect to='/' />);
    }

    let per = null;
    if (this.props.location.per){
        per = this.props.location.per
    }
    else {
      return (<Redirect to='/' />);
    }


    return (
        <div>
        <Box m={18}  pl={8}>
            <Typography component='div'>
                <Link component={RouterLink} to={{
                    pathname: '/activities',
                    expandedProject: owner,
                    expandedPerson: per}}>
                    <Grid container spacing={1} justify='flex-start' alignItems='stretch'>
                        <Grid item>
                            <ArrowCircleLeftRoundedIcon color={'primary'}/>
                        </Grid>
                        <Grid item> zurück zu {owner.project.getProjectName()}
                        </Grid>
                    </Grid>
                </Link>
            </Typography>

            <Grid container direction={'row'} mt={2} alignItems='stretch' spacing={1}>
                <Grid xs={3}/>
                <Grid item xs={5} align={'center'}>
                    <Typography variant={"h4"} algin={"center"} component={"div"}>
                       Aktivität: {owner.activity.getActivityName()}
                    </Typography>
                 </Grid>
                <Grid item xs={2} align={'right'}>
                    <Button variant='contained' color='primary' onClick={this.handleStartEventButtonClicked}>
                        Start buchen
                    </Button>
                </Grid>
                <Grid item xs={2} align={'right'}>
                    <Button variant='contained' color='primary' onClick={this.handleEndEventButtonClicked}>
                        Ende buchen
                    </Button>
                </Grid>
            </Grid>


          <Grid container mt={3}>
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
                    <ProjectWorkListEntry key={pw.getID()} project={owner.project} person={per.person} projectWork={pw}
                                          onProjectWorkDeleted={this.projectWorkDeleted}/>)
                }

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
            <ProjectWorkForm activity={owner.activity} onClose={this.projectWorkFormClosed} show={showProjectWorkForm}></ProjectWorkForm>
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