import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HdMWebAppAPI } from '../api';

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
      };

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
  }
  componentDidMount() {
    this.getCustomers();
  }
}
  /** PropTypes */
CustomerList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}
export default withRouter(withStyles(styles)(PersonList));