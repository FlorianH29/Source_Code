import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI, PersonBO} from "../../api";
import CheckboxForm from "../CheckboxForm";

import {Divider} from "@mui/material";


class ProjectMemberForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectMember: projectMember,
        }
    }


    addProjectMember = () => {
        let newProjectMember = new PersonBO(this.state.firstName, this.state.lastName,
            this.state.affiliatedProject);
        //console.log(newProjectMember);
        HdMWebAppAPI.getAPI().addProjectMember(newProjectMember).then(projectMember => {
            // Backend call erfolgreich
            this.setState(this.baseState);
            this.props.onClose(projectMember); // call the parent with the customer object from backend
        }).catch(e =>
            console.log(e)
        );
    }


    render() {
        const {projectMember, person, show} = this.props;
        const {potentialProjectMembers} = this.state;

        let title = 'Mitarbeiter zu dem Projekt hinzufügen';
        let header = 'Mitartbeiter:';

        return (

            show ?
                <Dialog open={true} onClose={this.handleClose} maxWidth='xl'>
                    <DialogTitle id='form-dialog-title'>{title}
                        <IconButton algin={'right'} onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>

                        <CheckboxForm {/**projectMember={} person={} project={}*/} show={CheckboxForm}></CheckboxForm>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button color='primary' onClick={this.addProjectMember}>
                            Hinzufügen
                        </Button>
                    </DialogActions>
                </Dialog>


        );

    }
}


ProjectMemberForm.propTypes = {
   /** @ignore */
   projectMember: PropTypes.object.isRequired,
   person: PropTypes.object.isRequired,
   /** The CustomerBO of this AccountList */
   project: PropTypes.object.isRequired,
   /** If true, accounts are (re)loaded */
   show: PropTypes.bool.isRequired,
}

export default ProjectMemberForm;