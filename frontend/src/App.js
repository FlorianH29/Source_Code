import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {HdMWebAppAPI} from "./api";
import {PersonBO} from "./api";
import PersonList from './components/PersonList';
import Header from './components/layout/Header';
import ProjectList from "./components/ProjectList";
import SignIn from './components/pages/SignIn';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseconfig';



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
		const { currentPerson} = this.state;

        return (
            <Router basename={process.env.PUBLIC_URL}>
                <Header person={currentPerson} />

                {
                    currentPerson ?
                        <>
                            <Redirect from='/' to='/persons'/>
                            <Route exact path='/persons'>
                                <PersonList/>
                            </Route>

                            <Route  path='/projects'>
                                <ProjectList/>
                            </Route>
                        </>

                        :
                        <>
                            <Redirect to='/index.html' />
                            <SignIn onSignIn={this.handleSignIn} />
                        </>

                }

            </Router>
        );
    }
}

export default App;
