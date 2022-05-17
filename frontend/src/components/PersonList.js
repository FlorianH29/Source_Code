import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HdMWebAppAPI } from '../api';
import { withStyles } from '@mui/material/styles';
import AddIcon from '@mui/material/Icon';
import ClearIcon from '@mui/material/Icon'



class PersonList extends Component {

  constructor(props) {
      super(props);

      // console.log(props);
      let expandedID = null;

      if (this.props.location.expandPerson) {
        expandedID = this.props.location.expandPerson.getID();
      }

      // Init an empty state
      this.state = {
          persons: [],
          filteredPersons: [],
          personsFilter: '',
          error: null,
          loadingInProgress: false,
          expandedPersonID: expandedID,
          showPersonForm: false
      };}

  getPersons = () => {
    HdMWebAppAPI.getAPI().getPersons()
      .then(personBOs =>
        this.setState({               // Set new state when CustomerBOs have been fetched
          persons: personBOs,
          filteredPersons: [...personBOs], // store a copy
          loadingInProgress: false,   // disable loading indicator
          error: null
        })).catch(e =>
         this.setState({             // Reset state with error from catch
           persons: [],
           loadingInProgress: false, // disable loading indicator
           error: e
        }));

          // set loading to true
    this.setState({
      loadingInProgress: true,
      error: null
    });
  }

  componentDidMount() {
    this.getPersons();
  }

  onExpandedStateChange = person => {
    // console.log(personID);
    // Set expandend customer entry to null by default
    let newID = null;

    // If same customer entry is clicked, collapse it else expand a new one
    if (person.getID() !== this.state.expandedPersonID) {
      // Expand the person entry with personID
      newID = person.getID();
    }
    // console.log(newID);
    this.setState({
      expandedPersonID: newID,
    });
  }

  personDeleted = person => {
    const newPersonList = this.state.persons.filter(personFromState => personFromState.getID() !== person.getID());
    this.setState({
      persons: newPersonList,
      filteredPersons: [...newPersonList],
      showPersonForm: false
    });
  }

  /** Handles the onClick event of the add customer button */
  addPersonButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the PersonForm
    this.setState({
      showPersonForm: true
    });
  }

  personFormClosed = person => {
    // customer is not null and therefore created
    if (person) {
      const newPersonList = [...this.state.persons, person];
      this.setState({
        persons: newPersonList,
        filteredPersons: [...newPersonList],
        showPersonsForm: false
      });
    } else {
      this.setState({
        showPersonsForm: false
      });
    }
  }

  /** Handels onChange events of the customer filter text field */
  filterFieldValueChange = event => {
    const value = event.target.value.toLowerCase();
    this.setState({
      filteredPersons: this.state.persons.filter(person => {
        let firstNameContainsValue = person.getFirstName().toLowerCase().includes(value);
        let lastNameContainsValue = person.getLastName().toLowerCase().includes(value);
        return firstNameContainsValue || lastNameContainsValue;
      }),
      personFilter: value
    });
  }

  clearFilterFieldButtonClicked = () => {
    // Reset the filter
    this.setState({
      filteredPersons: [...this.state.persons],
      personFilter: ''
    });
  }

  render() {
    const { classes } = this.props;
    const { filteredPersons, personFilter, expandedPersonID, loadingInProgress, error, showPersonForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.personFilter} container spacing={1} justify='flex-start' alignItems='center'>
          <Grid item>
            <Typography>
              Filter person list by name:
              </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              fullWidth
              id='personFilter'
              type='text'
              value={personFilter}
              onChange={this.filterFieldValueChange}
              InputProps={{
                endAdornment: <InputAdornment position='end'>
                  <IconButton onClick={this.clearFilterFieldButtonClicked}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={this.addPersonButtonClicked}>
              Add Person
          </Button>
          </Grid>
        </Grid>
        {
          // Show the list of CustomerListEntry components
          // Do not use strict comparison, since expandedCustomerID maybe a string if given from the URL parameters
          filteredPersons.map(person =>
            <PersonListEntry key={person.getID()} person={person} expandedState={expandedPersonID === person.getID()}
              onExpandedStateChange={this.onExpandedStateChange}
              onPersonDeleted={this.personDeleted}
            />)
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of persons could not be loaded.`} onReload={this.getPersons} />
        <PersonForm show={showPersonForm} onClose={this.personFormClosed} />
      </div>
    );
  }

}
/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  personFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

  /** PropTypes */
PersonList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}
export default withRouter(withStyles(styles)(PersonList));