import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography, withStyles } from '@material-ui/core';


class SignIn extends Component {


	/**
	 *
	 */
	handleSignInButtonClicked = () => {
		this.props.onSignIn();
	}
/**	handleButton = () => {
         this.props.history.push('/welcome')
	}

	/**  */
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.root} align='center' variant='h6'>Wilkommen zur Arbeitszeiterfassung</Typography>
				<Typography className={classes.root} align='center'>Bitte melden Sie sich an</Typography>
				<Grid container justifyContent='center'>
					<Grid item>
						<Button variant='contained' color='primary' onClick={this.handleSignInButtonClicked} /**onClick={this.handleButton()}*/>
							Sign in with Google
      					</Button>
					</Grid>
				</Grid>
			</div>
		);
	}
}

/** Design */
const styles = theme => ({
	root: {
		margin: theme.spacing(2)
	}
});

/** PropTypes */
SignIn.propTypes = {
	/** @ignore */
	classes: PropTypes.object.isRequired,
	/**
	 * Handler function, which is called if the user wants to sign in.
	 */
	onSignIn: PropTypes.func.isRequired,
}

export default withStyles(styles)(SignIn)