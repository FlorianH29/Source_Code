import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {HdMWebAppAPI} from "./api";
import {PersonBO} from "./api";
import PersonList from './components/pages/PersonList';
import Header from './components/layout/Header';
import ProjectList from "./components/pages/ProjectList";
import WorktimeAccount from "./components/pages/WorktimeAccount";
import NotFound from "./components/pages/NotFound";
import SignIn from './components/pages/SignIn';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseconfig';
import ActivityList from "./components/pages/ActivityList";


class App extends React.Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            currentPerson: null,
            authError: null
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
    }

    componentDidMount() {
        firebase.initializeApp(firebaseConfig);
        firebase.auth().languageCode = 'de';
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
    }


    render() {
        const {currentPerson} = this.state;

        return (
            <Router>
                <Header person={currentPerson}/>

                {
                    currentPerson ?
                        <>
                            <Switch>
                                <Route exact path='/persons'>
                                    <PersonList/>
                                </Route>
                                <Route exact path='/projects'>
                                    <ProjectList/>
                                </Route>
                                <Route exact path='/worktimeaccount'>
                                    <WorktimeAccount/>
                                </Route>
                                <Route exact path='/activities'>
                                    <ActivityList/>
                                </Route>
                                <Route path='*'>
                                    <NotFound/>
                                </Route>
                            </Switch>
                        </>

                        :
                        <>
                            <SignIn onSignIn={this.handleSignIn}/>
                        </>
                }
            </Router>
        );
    }
}

export default App;
