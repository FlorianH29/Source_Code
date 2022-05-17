import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WorktimeaccountList from './WorktimeaccountList';



/**
 * Renders a CustomerBO object within a expandable/collapsible CustomerListEntry with the customer manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [AccountList](#accountlist)
 *
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class PersonListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      person: props.person,
      showPersonForm: false,
      showPersonDeleteDialog: false,
    };
  }

  /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.person);
  }

  /** Handles onAccountDelete events from an AccountListEntry  */
  deleteWorktimeaccountHandler = (deletedWorktimeaccount) => {
    // console.log(deletedWorktimeaccount.getID());
    this.setState({
      worktimeaccounts: this.state.worktimeaccounts.filter(worktimeaccount => worktimeaccount.getID() !== deletedWorktimeaccount.getID())
    })
  }

  /** Handles the onClick event of the edit customer button */
  editCustomerButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showCustomerForm: true
    });
  }

  /** Handles the onClose event of the CustomerForm */
  customerFormClosed = (person) => {
    // customer is not null and therefor changed
    if (person) {
      this.setState({
        person: person,
        showCustomerForm: false
      });
    } else {
      this.setState({
        showCustomerForm: false
      });
    }
  }

  /** Handles the onClick event of the delete customer button */
  deleteCustomerButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showCustomerDeleteDialog: true
    });
  }

  /** Handles the onClose event of the CustomerDeleteDialog */
  deleteCustomerDialogClosed = (person) => {
    // if customer is not null, delete it
    if (person) {
      this.props.onCustomerDeleted(person);
    };

    // Don´t show the dialog
    this.setState({
      showCustomerDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, expandedState } = this.props;
    // Use the states customer
    const { person, showCustomerForm, showCustomerDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`person${person.getID()}worktimeaccountpanel-header`}
          >
            <Grid container spacing={1} justify='flex-start' alignItems='center'>
              <Grid item>
                <Typography variant='body1' className={classes.heading}>{person.getLastName()}, {person.getFirstName()}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonGroup variant='text' size='small'>
                  <Button color='primary' onClick={this.editCustomerButtonClicked}>
                    edit
                  </Button>
                  <Button color='secondary' onClick={this.deleteCustomerButtonClicked}>
                    delete
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Typography variant='body2' color={'textSecondary'}>List of worktimeaccounts</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <WorktimeaccountList show={expandedState} person={person} />
          </AccordionDetails>
        </Accordion>
        <CustomerForm show={showCustomerForm} person={person} onClose={this.customerFormClosed} />
        <CustomerDeleteDialog show={showCustomerDeleteDialog} person={person} onClose={this.deleteCustomerDialogClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  }
});

/** PropTypes */
PersonListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO to be rendered */
  customer: PropTypes.object.isRequired,
  /** The state of this CustomerListEntry. If true the customer is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this CustomerListEntry
   *
   * Signature: onExpandedStateChange(CustomerBO customer)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /**
   *  Event Handler function which is called after a sucessfull delete of this customer.
   *
   * Signature: onCustomerDelete(CustomerBO customer)
   */
  onCustomerDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(PersonListEntry);
