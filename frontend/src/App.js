import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {HdMWebAppAPI} from "./api";
import {PersonBO} from "./api";
import PersonList from './components/PersonList';

class App extends React.Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            currentUser: null
        };
    }

    render() {
        return (
            <Router basename={process.env.PUBLIC_URL}>

                {
                    true ?
                        <>
                            <Redirect from='/' to='persons'/>
                            <Route exact path='/persons'>
                                <PersonList/>
                            </Route>
                        </>
                        :
                        <>
                            <p>Sign In </p>

                        </>
                }
            </Router>
        );
    }
}

export default App;
