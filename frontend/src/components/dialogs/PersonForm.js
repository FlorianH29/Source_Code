import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HdMWebAppAPI, PersonBO } from '../../api';




/**
 * Shows a modal form dialog for a CustomerBO in prop customer. If the customer is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given CustomerBO object.
 * If the customer is null, the dialog is configured as a new customer dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a customer.
 * After that, the function of the onClose prop is called with the created/update CustomerBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class PersonForm extends Component {

  constructor(props) {
    super(props);

    let fn = '', ln = '', ma = '', fb = '';
    if (props.person) {
      fn = props.person.getFirstName();
      ln = props.person.getLastName();
      ma = props.person.getMailAddress();
      fb = props.person.getFireBaseId();
    }

    // Init the state
    this.state = {
      firstName: fn,
      firstNameValidationFailed: false,
      firstNameEdited: false,
      lastName: ln,
      lastNameValidationFailed: false,
      lastNameEdited: false,
      mailAdress: ma,
      mailAdressValidationFailed: false,
      mailAdressEdited: false,
      firebase_id: fb,
      firebase_idValidationFailed: false,
      firebase_idEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  /** Adds the customer */
  addPerson = () => {
    let newPerson = new PersonBO(this.state.firstName, this.state.lastName, this.state.mailAdress, this.state.firebase_id);
    HdMWebAppAPI.getAPI().addPerson(newPerson).then(person => {
      this.setState(this.baseState);
      this.props.onClose(person); // call the parent with the customer object from backend
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }
    /** Updates the customer */
  updatePerson = () => {
    // clone the original cutomer, in case the backend call fails
    let updatedPerson = Object.assign(new PersonBO(), this.props.person);
    // set the new attributes from our dialog
    updatedPerson.setFirstName(this.state.firstName);
    updatedPerson.setLastName(this.state.lastName);
    updatedPerson.setMailAddress(this.state.mailAdress);
    updatedPerson.setFireBaseId(this.state.firebase_id);
    HdMWebAppAPI.getAPI().updatePerson(updatedPerson).then(person => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.firstName = this.state.firstName;
      this.baseState.lastName = this.state.lastName;
      this.baseState.mailAdress = this.state.mailAdress;
      this.baseState.firebase_id = this.state.firebase_id;
      this.props.onClose(updatedPerson);      // call the parent with the new customer
    }).catch(e =>
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: e                        // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,                 // show loading indicator
      updatingError: null                       // disable error message
    });
  }

  /** Handles value changes of the forms textfields and validates them */
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

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  }

  /** Renders the component */
  render() {
    const { classes, person, show } = this.props;
    const { firstName, firstNameValidationFailed, firstNameEdited, lastName, lastNameValidationFailed, lastNameEdited,
      mailAdress, mailAdressValidationFailed, mailAdressEdited, firebase_id, firebaseidValidationFailed, firebaseidEdited,
      addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

    let title = '';
    let header = '';

    if (person) {
      // customer defindet, so ist an edit dialog
      title = 'Update a Person';
      header = `Person ID: ${person.getID()}`;
    } else {
      title = 'Create a new person';
      header = 'Enter person data';
    }

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose} maxWidth='xs'>
          <DialogTitle id='form-dialog-title'>{title}
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {header}
            </DialogContentText>
            <form className={classes.root} noValidate autoComplete='off'>
              <TextField autoFocus type='text' required fullWidth margin='normal' id='firstName' label='First name:' value={firstName}
                onChange={this.textFieldValueChange} error={firstNameValidationFailed}
                helperText={firstNameValidationFailed ? 'The first name must contain at least one character' : ' '} />
              <TextField type='text' required fullWidth margin='normal' id='lastName' label='Last name:' value={lastName}
                onChange={this.textFieldValueChange} error={lastNameValidationFailed}
                helperText={lastNameValidationFailed ? 'The last name must contain at least one character' : ' '} />
              <TextField type='text' required fullWidth margin='normal' id='mailadress' label='Mailadress:' value={mailAdress}
                onChange={this.textFieldValueChange} error={mailAdressValidationFailed}
                helperText={mailAdressValidationFailed ? 'The last name must contain at least one character' : ' '} />
              <TextField type='token' required fullWidth margin='normal' id='lastName' label='Last name:' value={firebase_id}
                onChange={this.textFieldValueChange} error={firebaseidValidationFailed}
                helperText={firebaseidValidationFailed ? 'The last name must contain at least one character' : ' '} />
            </form>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              Cancel
            </Button>
            {
              // If a customer is given, show an update button, else an add button
              person ?
                <Button disabled={firstNameValidationFailed || lastNameValidationFailed|| mailAdressValidationFailed || firebaseidValidationFailed} variant='contained' onClick={this.updatePerson} color='primary'>
                  Update
              </Button>
                : <Button disabled={firstNameValidationFailed || !firstNameEdited || lastNameValidationFailed || !lastNameEdited|| mailAdressValidationFailed || !mailAdressEdited || firebaseidValidationFailed|| !firebaseidEdited} variant='contained' onClick={this.addPerson} color='primary'>
                  Add
             </Button>
            }
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

/** PropTypes */
PersonForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO to be edited */
  person: PropTypes.object,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created CustomerBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(CustomerBO customer);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(PersonForm);