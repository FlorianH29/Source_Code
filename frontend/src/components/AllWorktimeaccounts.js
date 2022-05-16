import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { HdMWebAppAPI } from '../api';


/**
 * Shows all accounts of the bank.
 *
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class AllAccountList extends Component {

  constructor(props) {
    super(props);

    // Init an empty state
    this.state = {
      worktimeaccounts: [],
      loadingInProgress: false,
      loadingError: null,
    };
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.loadWorktimeaccounts();
  }

  /** gets the account list for this account */
  loadWorktimeccounts = () => {
    HdMWebAppAPI.getAPI().getAllWorktimeaccounts().then(worktimeaccounts =>
      this.setState({
        worktimeaccounts: worktimeaccounts,
        loadingInProgress: false, // loading indicator
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          loadingInProgress: false,
          loadingError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingError: null
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { worktimeaccounts, loadingInProgress, loadingError } = this.state;

    return (
      <div className={classes.root}>
          {
            worktimeaccounts.map(worktimeaccount => <WorktimeccountDetail key={worktimeaccount.getID()}
            personID={worktimeaccount.getOwner().toString()} worktimeaccountID={worktimeaccount.getID().toString()} />)
          }
          <LoadingProgress show={loadingInProgress} />
          <ContextErrorMessage error={loadingError} contextErrorMsg={`The list of all accounts of the bank could not be loaded.`} onReload={this.loadWorktimeccounts} />
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
AllWorktimeaccountList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AllAccountList);
