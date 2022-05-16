import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router';
import { HdMWebAppAPI } from '../api';


class TransactionList extends Component {

  #myWorktimeaccount = null;

  constructor(props) {
    super(props);

    // Store the underlying AccountBO given from the calling link of the RouterLink of React Router
    this.#myWorktimeaccount = this.props.location.owner.worktimeaccount;

    // Init an empty state
    this.state = {
      transactions: [],
      transactionsLoadingInProgress: false,
      //creditsLoadingError: null,
      //debitsLoadingError: null,
    };
  }


  /**
   * Returns the underlying AccountBO given from the calling link of the RouterLink of React Router
   */
  getWorkTimeAccount() {
    return this.#myWorktimeaccount;
  }

  /**
   * Compares two TransactioBOs to sort them by their id field. Sorts the lowest id first.
   * The ID is used as replacement a timestamp.
   *
   * Returns -1 if a < b
   * Returns 1 if a > b
   * Returns 0 if a = b
   *
   * @param {TransactionBO} transactionA
   * @param {TransactionBO} transactionB
   */
  transactionComparator(transactionA, transactionB) {
    let result = 0;

    if (transactionA.getID() < transactionB.getID()) {
      result = -1;
    }
    if (transactionA.getID() > transactionB.getID()) {
      result = 1;
    }

    return result;
  }

  /**
   * Fetches credit and debit TransactionBOs from the backend. The two operations are chained.
   * Credit and debit transactions are marked with the transaction type and then concatinated into one array
   * of transactions. This array is then sorted with the transactionComparator function.
   */
  getTransactions = () => {
    const { worktimeaccount } = this.props.location.owner;

    HdMWebAppAPI.getAPI().getCreditsForWorktimeaccount(worktimeaccount.getID())
      .then(creditTransactionBOs => {
        HdMWebAppAPI.getAPI().getDebitsForWorktimeaccount(worktimeaccount.getID()).then(debitTransactionBOs => {
          let transactions = creditTransactionBOs.concat(debitTransactionBOs);

          // Sorts the transactions by ascending ID, since the ID can serve as a timestamp.
          // A higher ID indicates a newer transaction.
          transactions.sort(this.transactionComparator);

          // set final state
          this.setState({
            transactions: transactions,
            transactionsLoadingInProgress: false,
            debitsLoadingError: null
          })
        }).catch(e => this.setState({
          transactions: [],
          debitsLoadingError: e,
          transactionsLoadingInProgress: false,
        }));

        // set inter state
        this.setState({
          creditsLoadingError: null,
        })
      }).catch(e =>
        this.setState({
          transactions: [],
          transactionsLoadingInProgress: false,
          creditsLoadingError: e
        })
      );

    // set loading to true
    this.setState({
      transactionsLoadingInProgress: true,
      creditsLoadingError: null,
      debitsLoadingError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    // load only if the owner object is given
    if (this.props.location.owner) {
      this.getTransactions();
    }
  }


  /** Render a single row in the transaction table */
  renderTransactionRow(transaction, balance) {
    // For accessibility, the first column is set to be a <th> element, with a scope of 'row'.
    // This enables screen readers to identify a cell's value by it's row and column name.

    let currencyFormatter = HdMWebAppAPI.getAPI().getCurrencyFormatter();

    return (
      <TableRow key={transaction.getID()}>
        <TableCell align='center' component='th' scope='row'>
          {transaction.getID()}
        </TableCell>
        <TableCell align='center'>{transaction.getSourceAccount()}</TableCell>
        <TableCell align='center'>{transaction.getTargetAccount()}</TableCell>

        {
          // Its a credit if this account is the target of the transaction
          this.getWorktimeaccount().getID() === transaction.getTargetWorktimeaccount() ?
            <React.Fragment>
              <TableCell align='right'>{currencyFormatter.format(transaction.getAmount())}</TableCell>
              <TableCell align='right'>{}</TableCell>
            </React.Fragment>
            :
            <React.Fragment>
              <TableCell align='left'>{}</TableCell>
              <TableCell align='left'>{currencyFormatter.format(transaction.getAmount())}</TableCell>
            </React.Fragment>
        }
        <TableCell align='center'>{currencyFormatter.format(balance)}</TableCell>
      </TableRow>
    );
  }

  /** Render the body of the table with all transactions */
  renderTransactions() {
    let balance = 0;

    return this.state.transactions.map(transaction => {
      if (this.getWorktimeaccount().getID() === transaction.getTargetWorktimeaccount()) {
        // Its a credit, since this account is the target of the transaction
        balance += transaction.getAmount();
      } else {
        balance -= transaction.getAmount();
      }
      return this.renderTransactionRow(transaction, balance);
    });
  }

  /** Render the transaction table  */
  renderTransactionTable() {
    const { transactionsLoadingInProgress, creditsLoadingError, debitsLoadingError } = this.state;

    if (!transactionsLoadingInProgress && !creditsLoadingError && !debitsLoadingError) {
      return (
        <TableContainer component={Paper}>
          <Typography className={this.props.classes.tableHeader}>
            List of transactions:
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>Source account</TableCell>
                <TableCell align='center'>Target account</TableCell>
                <TableCell align='right'>Credit</TableCell>
                <TableCell align='left'>Debit</TableCell>
                <TableCell align='center'>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderTransactions()}
            </TableBody>
          </Table>
        </TableContainer>);
    }
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    let owner = null;
    if (this.props.location.owner) {
      // owner object exists
      owner = this.props.location.owner
    } else {
      // owner object does not exist, we are called directly by route URL
      // or the page has been refreshed -> put the user back to start page
      return (<Redirect to='/' />);
    }

    const { person, worktimeaccount } = owner;
    const { transactionsLoadingInProgress, creditsLoadingError, debitsLoadingError } = this.state;

    return (
      <div>
        <Typography component='div' className={classes.subNav}>
          <Link component={RouterLink} to={{
            pathname: '/persons',
            expandCustomer: person
          }}>
            <Grid container spacing={1} justify='flex-start' alignItems='stretch'>
              <Grid item>
                <ArrowBackIcon />
              </Grid>
              <Grid item>
                Back to customer list
              </Grid>
            </Grid>
          </Link>
        </Typography>

        <Paper className={classes.root}>
          <Typography variant='h6'>
            Worktimeaccount
          </Typography>
          <Typography className={classes.worktimeaccountEntry}>
            ID: {worktimeaccount.getID()}
          </Typography>
          <Typography>
            Person: {person.getLastName()}, {person.getFirstName()}
          </Typography>
        </Paper>

        {this.renderTransactionTable()}

        <LoadingProgress show={transactionsLoadingInProgress} />
        <ContextErrorMessage error={creditsLoadingError} contextErrorMsg={`The credits of account ${this.worktimeaccountID} could not be loaded.`} onReload={this.getTransactions} />
        <ContextErrorMessage error={debitsLoadingError} contextErrorMsg={`The debits of account ${this.worktimeaccountID} could not be loaded.`} onReload={this.getTransactions} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(1),
  },
  subNav: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  tableHeader: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
  }
});

/** PropTypes */
TransactionList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  match: PropTypes.object.isRequired,
}

export default withRouter (withStyles(styles)(TransactionList));