import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PersonBO, HdMWebAppAPI} from "../../api";
import CheckboxListEntry from "../CheckboxListEntry";
import {List} from "@mui/material";
import {
    withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';



class CheckboxForm extends Component {

    constructor(props) {
        super(props);

        /*let fn = '', ln = '', pro = 1;
        if (props.potentialProjectMembers) {
            fn = props.potentialProjectMembers.getFirstName();
            ln = props.potentialProjectMembers.getLastName();
            pro = 1
        }*/

        this.state = {
            selectedPerson: [],
            personFirstName: "",
            personLastName: "",
            affiliatedProject: 1,
        };
        this.baseState = this.state;
    }

    handleClose = () => {
        // den state neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        console.log("test")
        this.setState(this.baseState);
        this.props.onClose(null);
        this.getPotentialMembersForProject();
        this.props.getProjectMembersOfProject();
    }


    addSelectedPersonsToProject = () => {
        console.log(this.state.selectedPerson)
        HdMWebAppAPI.getAPI().addPersonAsProjectMember(this.state.selectedPerson, this.props.project.getID());
            this.props.onClose(null);
    }

    componentDidMount() {
        this.props.getPotentialMembersForProject();
    }

    setSelectedPersons = (ppm) => {
        this.state.selectedPerson.push(ppm)
        console.log(this.state.selectedPerson)
    }

    removeSelectedPersons = (ppm) => {
        this.state.selectedPerson.splice(this.state.selectedPerson.indexOf(ppm), 1)
        console.log(this.state.selectedPerson)
    }


    render() {
        const {projectMember, person, show, project} = this.props;
        console.log(this.props.potentialProjectMembers);

        let title = 'Mitarbeiter zu dem Projekt hinzufügen';
        let header = 'Mitartbeiter die bis jetzt noch nicht im Projekt sind:';

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
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            {this.props.potentialProjectMembers.map((value) =>
                                <CheckboxListEntry potentialProjectMember={value} key={value}
                                                   addPerson={this.setSelectedPersons}
                                                   removePerson={this.removeSelectedPersons}/>)}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button color='primary' onClick={this.addSelectedPersonsToProject}>
                            Hinzufügen
                        </Button>

                    </DialogActions>
                </Dialog>
                : null
        )
    }
}


export default CheckboxForm;
