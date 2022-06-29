import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {HdMWebAppAPI, PersonBO} from '../../api';


class PersonEditDialog extends Component {

    constructor(props) {
        super(props);

        let fn = '', ln = '', ma = '', un = '';
        if (props.person) {
            fn = props.person.getFirstName();
            ln = props.person.getLastName();
            ma = props.person.getMailAddress();
            un = props.person.getUserName();
        }

        // den state initialisieren
        this.state = {
            firstname: fn,
            lastname: ln,
            mailAdress: ma,
            userName: un,
            firstnameValidationFailed: false,
            lastnameValidationFailed: false
        };
        this.baseState = this.state;
    }

    /** Die Person bearbeiten */
    editPerson = () => {
        let editedPerson = Object.assign(new PersonBO(), this.props.person);
        editedPerson.setFirstName(this.state.firstname);
        editedPerson.setLastName(this.state.lastname);
        editedPerson.setMailAddress(this.state.mailAdress);
        editedPerson.setUserName(this.state.userName);
        HdMWebAppAPI.getAPI().editPerson(editedPerson).then(person => {
            this.baseState.firstname = this.state.firstname;
            this.baseState.lastname = this.state.lastname;
            this.baseState.mailAdress = this.state.mailAdress;
            this.baseState.userName = this.state.userName;
            console.log(this.state);
            this.props.onClose(editedPerson);
        });
    }

    /** Behandelt das Click Event des Buttons Abbrechen */
    handleClose = () => {
        // console.log(this.props);
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    textFieldValueChange = (event) => {
        const value = event.target.value;

        let error = false;
        if (value.trim().length === 0) {
            error = true;
        }

        this.setState({
            [event.target.id]: event.target.value,
            [event.target.id + 'ValidationFailed']: error,
            [event.target.id + 'Edited']: true
        });
    }

    /** Rendert die Komponente */
    render() {
        const {person, show} = this.props;
        const {firstnameValidationFailed, lastnameValidationFailed, firstname, lastname, mailAdress, userName} = this.state;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose} maxWidth='xl'>
                    <DialogTitle>Profil bearbeiten
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                    <form noValidate autoComplete='off'>
                        <TextField autoFocus type='text' required fullWidth margin='normal' id='firstname'
                                   label='Vorname:' value={firstname}
                                   onChange={this.textFieldValueChange} error={firstnameValidationFailed}
                                   helperText={firstnameValidationFailed ? 'Bitte geben Sie Ihren Vornamen an' : ' '}/>
                        <TextField type='text' required fullWidth margin='normal' id='lastname' label='Nachname:'
                                   value={lastname}
                                   onChange={this.textFieldValueChange} error={lastnameValidationFailed}
                                   helperText={lastnameValidationFailed ? 'Bitte geben Sie Ihren Nachnamen an' : ' '}/>
                         <TextField type='text' required fullWidth margin='normal' id='userName' label='Benutzername:'
                                   value={userName}
                                   onChange={this.textFieldValueChange} error={lastnameValidationFailed}
                                   helperText={lastnameValidationFailed ? 'Bitte geben Sie einen Benutzernamen an' : ' '}/>
                         <TextField type='text' required fullWidth margin='normal' id='mailAdress' label='E-Mail:'
                                   value={mailAdress}
                                   onChange={this.textFieldValueChange} error={lastnameValidationFailed}
                                   helperText={lastnameValidationFailed ? 'Bitte geben Sie Ihre E-Mail Adresse an' : ' '}/>
                    </form>
                    </DialogContent>
                    <DialogActions>
                        <Button align="left" onClick={this.handleClose} color='secondary'>
                            Abbrechen
                        </Button>
                        <Button align="right" color='primary' onClick={this.editPerson}>
                            Sichern
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

/** PropTypes */
PersonEditDialog.propTypes = {
    /** Das ProjectWorkBO, das gelöscht werden soll */
    person: PropTypes.object.isRequired,
    /**
     * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
     * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
     */
    onClose: PropTypes.func.isRequired,
}


export default PersonEditDialog;