import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HdMWebAppAPI } from '../api';


/**
 * Renders a list of AccountListEntry objects.
 *
 * @see See [AccountListEntry](#accountlistentry)
 *
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class WorktimeaccountList extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      worktimeaccounts: [],
      loadingInProgress: false,
      loadingAccountError: null,
      addingAccountError: null,
    };
  }

  /** Fetches AccountBOs for the current customer */
  getWorktimeaccounts = () => {
    HdMWebAppAPI.getAPI().getWorktimeaccountsForPerson(this.props.person.getID()).then(worktimeaccountBOs =>
      this.setState({  // Set new state when AccountBOs have been fetched
        worktimeaccounts: worktimeaccountBOs,
        loadingInProgress: false, // loading indicator
        loadingAccountError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          worktimeaccounts: [],
          loadingInProgress: false,
          loadingAccountError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingAccountError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getWorktimeccounts();
  }

  /** Lifecycle method, which is called when the component was updated */
  componentDidUpdate(prevProps) {
    // reload accounts if shown state changed. Occures if the CustomerListEntrys ExpansionPanel was expanded
    // if ((this.props.show !== prevProps.show)) {
    //   this.getAccounts();
    // }
  }

  /** Adds an account for the current customer */
  addWorktimeaccount = () => {
    HdMWebAppAPI.getAPI().addWorktimeaccountForPerson(this.props.customer.getID()).then(worktimeaccountBO => {
      // console.log(accountBO)
      this.setState({  // Set new state when AccountBOs have been fetched
        worktimeaccounts: [...this.state.worktimeaccounts, worktimeaccountBO],
        loadingInProgress: false, // loading indicator
        addingAccountError: null
      })
    }).catch(e =>
      this.setState({ // Reset state with error from catch
        worktimeaccounts: [],
        loadingInProgress: false,
        addingAccountError: e
      })
    );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      addingAccountError: null
    });
  }

  /** Handles onAccountDelete events from an AccountListEntry  */
  deleteWorktimeaccountHandler = (deletedWorktimeaccount) => {
    // console.log(deletedAccount.getID());
    this.setState({
      worktimeaccounts: this.state.worktimeaccounts.filter(worktimeaccount => worktimeaccount.getID() !== deletedWorktimeaccount.getID())
    })
  }

  /** Renders the component */
  render() {
    const { classes, customer } = this.props;
    // Use the states customer
    const { worktimeaccounts, loadingInProgress, loadingWorktimeaccountError, addingWorktimeaccountError } = this.state;

    // console.log(this.props);
    return (
      <div className={classes.root}>
        <List className={classes.worktimeaccountList}>
          {
            worktimeaccounts.map(worktimeaccount => <WorktimeaccountListEntry key={worktimeaccount.getID()} person={person} worktimeaccount={worktimeaccount} onAccountDeleted={this.deleteWorktimeaccountHandler}
              show={this.props.show} />)
          }
          <ListItem>
            <LoadingProgress show={loadingInProgress} />
            <ContextErrorMessage error={loadingWorktimeaccountError} contextErrorMsg={`List of accounts for customer ${peron.getID()} could not be loaded.`} onReload={this.getWorktimeaccounts} />
            <ContextErrorMessage error={addingWorktimeaccountError} contextErrorMsg={`Account for customer ${person.getID()} could not be added.`} onReload={this.addWorktimeaccount} />
          </ListItem>
        </List>
        <Button className={classes.addWorktimeaccountButton} variant='contained' color='primary' startIcon={<AddIcon />} onClick={this.addAccount}>
          Add Account
        </Button>
      </div>
    );
  }
}


/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  accountList: {
    marginBottom: theme.spacing(2),
  },
  addAccountButton: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(1),
  }
});

/** PropTypes */
WorktimeaccountList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO of this AccountList */
  person: PropTypes.object.isRequired,
  /** If true, accounts are (re)loaded */
  show: PropTypes.bool.isRequired
}

export default withStyles(styles)(WorktimeaccountList);
