import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {ArriveBO, HdMWebAppAPI} from "../../api";
import PropTypes from 'prop-types';


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
    }

    /**handleButton = () => {
         this.props.history.push('/worktimeaccoung')
	}*/

    render() {
        const {  } = this.props;
        const { person } = this.state;
        return (
             <Box sx={{m: 15, b: 2, p: 2}}>
                <Card>
                    <Grid container spacing={2} justifyContent={"center"}  alignItems={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <h2>Willkommen in der Arbeitszeiterfassung</h2>
                            <p>Bitte bestätigen Sie Ihren Arbeitsbeginn:</p>
                            <Button variant={"contained"} color="success" onClick={this.addNewArriveEvent}>
                                    Kommen bestätigen
                            </Button>
                            <p></p>
                        </Grid>
                    </Grid>
                </Card>
             </Box>
        );
    }
}

Welcome.propTypes = {
  username: PropTypes.string.isRequired,
  /** Wenn show true ist, wird der Dialog gerendert */
  show: PropTypes.bool.isRequired,
  /**
   * Handler Funktion, die aufgerufen wird, wenn der Dialog geschlossen wird.
   * Sendet das gelöschte ProjectWorkBO as Parameter oder null, wenn Abbrechen aufgerufen worden ist.
   */
  onClose: PropTypes.func.isRequired,
}

export default Welcome;