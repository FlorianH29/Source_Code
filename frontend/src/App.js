import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ActivityList from "./components/ActivityList";
import Navigator from './components/layout/Navigator';
import ProjectList from "./components/ProjectList";
import ProjectWorkList from "./components/ProjectWorkList";
import NotFound from "./components/pages/NotFound";
import SignIn from './components/pages/SignIn';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseconfig';

import {Person} from "@mui/icons-material";
import TimeIntervalTransactionList from "./components/TimeIntervalTransactionList";
import SignInHeader from "./components/layout/SignInHeader";
import DepartureDialog from "./components/dialogs/DepartureDialog";
import {Dialog, Grid} from "@mui/material";
import {DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@mui/material/Button";
import {ArriveBO, HdMWebAppAPI} from "./api";
import ProjectAnalysis from "./components/ProjectAnalysis";


class App extends React.Component {

    constructor(props) {
        super(props);

        // Initiiere einen leeren State
        this.state = {
            currentPerson: null,
            authError: null,
            arrived: true
        };
    }

    handleAuthStateChange = person => {
        if (person) {
            this.setState({
                authLoading: true
            });
            person.getIdToken().then(token => {

                document.cookie = `token=${token};path=/`;
                this.setState({
                    currentPerson: person,
                    authError: null,
                    authLoading: false
                });
            }).catch(e => {
                this.setState({
                    authError: e,
                    authLoading: false
                });
            });
        } else {
            document.cookie = 'token=;path=/';

            this.setState({
                currentPerson: null,
                authLoading: false
            });
        }
    }

    handleSignIn = () => {
        this.setState({
            authLoading: true
        });
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        this.props.history.push('/welcome') /*try...*/
    }

    /** Gibt zurück, ob das letzte Gehen einer Person größer ist als das letzte Kommen */
    getDepartureBiggerArrive = () => {
        HdMWebAppAPI.getAPI().getDepartureBiggerArrive()
            .then(value => this.setState({
                arrived: value,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    arrived: true,
                })
            );
    }

    componentDidMount() {
        firebase.initializeApp(firebaseConfig);
        firebase.auth().languageCode = 'de';
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
        this.getDepartureBiggerArrive();
    }

    handleCloseArriveDialog = () => {
      this.setState({
          arrived: this.getDepartureBiggerArrive
      })
    }

    /* Erstellen eines Kommen-Events durch den Button im ArriveDialog**/
    addNewArriveEvent = () => {
      // Umschalten des Status der Knöpfe
      this.setState({

      });
      // Erstellen eines Gehen-Ereignis
      let newArriveEvent = new ArriveBO(this.state.firebase_id)
      HdMWebAppAPI.getAPI().addArrive().then(arrive => {
        //this.setState(this.baseState);
        //this.onClose(arrive); // call the parent with the departure object from backend
        console.log("test")
        this.setState({
            arrived: false
        })
      }).catch(e =>
        console.log(e)
      );
    }


    render() {
        const {currentPerson, authError, arrived} = this.state;

        console.log(this.state)
        return (
            <div style={{flex:1}}>
                <Router>

                {

                    currentPerson ?

                        <>
                            <Dialog open={arrived} onClose={this.handleCloseArriveDialog}>
                              <DialogTitle>Willkommen in der Arbeitszeiterfassung</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  Bitte bestätigen Sie Ihren Arbeitsbeginn:
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                  <Grid container justifyContent={'center'}>
                                    <Button variant='contained' onClick={() => {this.addNewArriveEvent()}} color='primary'>
                                        Kommen bestätigen
                                    </Button>
                                </Grid>
                              </DialogActions>
                            </Dialog>
                            <>
                                <Navigator person={currentPerson}/>
                                <Switch>


                                    <Route exact path='/projects'>
                                        <ProjectList/>
                                    </Route>
                                    <Route exact path='/projectworks'>
                                        <ProjectWorkList/>
                                    </Route>
                                    <Route exact path='/activities'>
                                        <ActivityList/>
                                    </Route>
                                    <Route exact path='/eventtransactionsandtimeintervaltransactions'>
                                        <TimeIntervalTransactionList/>
                                    </Route>
                                    <Route exact path='/projectanalysis'>
                                        <ProjectAnalysis/>
                                    </Route>
                                    <Route path='*'>
                                        <NotFound/>
                                    </Route>
                                </Switch>
                            </>
                        }

                            :

                        </>


                    :
                        <>
                            <SignInHeader person={currentPerson}/>
                            <SignIn onSignIn={this.handleSignIn}/>
                        </>

                }

            </Router>
          </div>
        );
    }
}

console.log(Person);

export default App;
