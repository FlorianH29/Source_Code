import React, {Component} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    Grid,
    Typography,
    withStyles
} from '@material-ui/core';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import ProjectWorkForm from './dialogs/ProjectWorkForm';
import ProjectWorkDeleteDialog from "./dialogs/ProjectWorkDeleteDialog";
import {HdMWebAppAPI} from "../api";


/**
 * Rendert ein ProjectWorkBO innerhalb eines auf- und zuklappbaren ProjectWorkListEntry.
 * Beinhaltet Funktionen, mit denen ein einzelnes ProjektWorkBO manipuliert werden kann.
 */

class ProjectWorkListEntry extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            projectWork: this.props.projectWork,
            owner: null,
            showProjectWorkForm: false,
            showProjectWorkDeleteDialog: false,
        };
    }

    /** Behandelt das onClick Event des ProjectWork bearbeiten Buttons */
    editProjectWorkButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectWorkForm: true
        });
    }

    /** Behandelt das onClose Event von ProjectWorkForm */
    projectWorkFormClosed = (projectWork) => {
        // projectWork ist nicht null und wurde dementsprechend geändert
        if (projectWork) {
            this.setState({
                projectWork: projectWork,
                showProjectWorkForm: false
            });
        } else {
            this.setState({
                showProjectWorkForm: false
            });
        }
    }

    /** Behandelt das onClose Event von ProjectWorkDeleteDialog */
    deleteProjectWorkDialogClosed = (projectWork) => {
        if (projectWork) {
            this.props.onProjectWorkDeleted(projectWork);
        }
        this.setState({
            showProjectWorkDeleteDialog: false // Den Dialog nicht mehr anzeigen
        });
    }

    /** Behandelt das onClick Event des ProjectWork löschen Buttons */
    deleteProjectWorkButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectWorkDeleteDialog: true
        });
    }

    componentDidMount() {
        this.getProjectWorkOwner();
    }

    /** Gibt den Owner dieser Projektarbeit zurück */
    getProjectWorkOwner = () => {
        if (this.props.projectWork.getID() > 0) {
            HdMWebAppAPI.getAPI().getOwnerOfProjectWork(this.props.projectWork.getID()).then(owner =>
                this.setState({
                    owner: owner,
                })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    owner: null,
                })
            );
        }
    }

    /** Renders the component */
    render() {
        const { person, project} = this.props;
        const {projectWork, showProjectWorkForm, showProjectWorkDeleteDialog, owner} = this.state;

    let projectWorkOwnerFN = '';
    let projectWorkOwnerLN = '';
    if (owner !== null) {
        projectWorkOwnerFN = owner.firstname;
        projectWorkOwnerLN = owner.lastname;
    }

    // console.log(this.state);
    return (
        owner ?
        <div>
            <Accordion>
                <AccordionSummary>
            <Grid container alignItems='center'>
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
                    {projectWork.getTimeIPeriod()}
                    </Typography>
                </Grid>
                {person.getID() === project.owner || person.getID() === owner.id ? (
                        <Grid item xs={3} align={"center"}>
                            <Button color='primary' size='small' startIcon={<EditIcon/>}
                                    onClick={this.editProjectWorkButtonClicked}> </Button>
                            <Button color='secondary' size='small' startIcon={<RemoveCircleOutlineRoundedIcon/>}
                                    onClick={this.deleteProjectWorkButtonClicked}> </Button>
                        </Grid>)
                    : <Grid item xs={3} align={"center"}>
                      </Grid>
                }

            </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant={"h5"} component={"div"}>
                    Beschreibung: {projectWork.getDescription()}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider/>
        <ProjectWorkDeleteDialog show={showProjectWorkDeleteDialog} projectWork={projectWork} onClose={this.deleteProjectWorkDialogClosed} />
        <ProjectWorkForm show={showProjectWorkForm} projectWork={projectWork} onClose={this.projectWorkFormClosed} />
      </div>
    : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
    root: {
        width: '100%',
    },
});

export default withStyles(styles)(ProjectWorkListEntry);