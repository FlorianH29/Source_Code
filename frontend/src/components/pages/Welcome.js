import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {ArriveBO, HdMWebAppAPI} from "../../api";
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer: null
        };
      }

/** Erstellen eines Arrive-Events */
    addNewArriveEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({

      });
      // Erstellen eines Gehen-Ereignis
      let newArriveEvent = new ArriveBO(this.state.firebase_id)
      HdMWebAppAPI.getAPI().addArrive().then(arrive => {
        // Backend call successful
        // reinit the dialogs state for a new empty customer
        this.setState(this.baseState);
        this.props.onClose(arrive); // call the parent with the departure object from backend
      }).catch(e =>
        console.log(e)
      );
         this.props.history.push('/eventtransactionsandtimeintervaltransactions')
    }

    /** Finde heraus, ob die letzte Eventtransaction ein Kommen- oder Gehen-Event war...*/


    /**handleButton = () => {
         this.props.history.push('/worktimeaccoung')
	}*/

    render() {
        const {  } = this.props;
        const { person, show } = this.state;
        return (
            show ?
               <Dialog open={show} onClose={this.handleClose}>

                  <DialogTitle>Willkommen in der Arbeitszeiterfassung</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Bitte bestätigen Sie Ihren Arbeitsbeginn:
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button variant='contained' onClick={() => {this.addNewArriveEvent()}} color='primary'>
                      Kommen bestätigen
                    </Button>
                  </DialogActions>

                </Dialog>

                :null
        );
    }
}

Welcome.propTypes = {
    /** Wenn show true ist, wird der Dialog gerendert */
    show: PropTypes.bool.isRequired
}

export default withRouter(Welcome);