import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {HdMWebAppAPI} from "../../api";
import PropTypes from 'prop-types';


class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer: null
        };
      }

    getPersons = () => {
        HdMWebAppAPI.getAPI().getPersons(this.props.username).then(username =>
            this.setState({
                customer: username
            }))
    };


    componentDidMount() {
        this.getPersons();
    }

    //addNewArriveEvent = () => {
        //HdMWebAppAPI.getAPI().addNewArriveEvent()
    //}

/** Erstellen eines Arrive-Events */
    addNewArriveEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({

          updatingError: null
      });
      // Erstellen eines Gehen-Ereignis
      let newArriveEvent = new ArriveBO(this.state.firebase_id)
      HdMWebAppAPI.getAPI().addArrive().then(arrive => {
        // Backend call successful
        // reinit the dialogs state for a new empty customer
        this.setState(this.baseState);
        this.props.onClose(arrive); // call the parent with the departure object from backend
      }).catch(e =>
        this.setState({
          updatingInProgress: false,    // disable loading indicator
          updatingError: e              // show error message
        })
      );
    }

    /**handleButton = () => {
         this.props.history.push('/worktimeaccoung')
	}*/

    render() {
        const {  } = this.props;
        const { person } = this.state;
        return (
             <Box sx={{m: 2, b: 2, p: 2}}>
                <Card>
                    <Grid container spacing={2} justifyContent={"center"}  alignItems={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <h2>Wilkommen, {this.props.username}</h2>
                            <p>Bitte bestätige deinen Arbeitsbeginn:</p>
                            <Button variant={"contained"} color="success" onClick={this.addNewArriveEvent()}>
                                    Kommen
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
}

export default Welcome;