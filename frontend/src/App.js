import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {HdMWebAppAPI} from "./api";
import {PersonBO} from "./api";
import PersonList from './components/pages/PersonList';
import Header from './components/layout/Header';
import ProjectList from "./components/pages/ProjectList";
import WorktimeAccount from "./components/pages/WorktimeAccount";
import NotFound from "./components/pages/NotFound";

class App extends React.Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <Router>
                {
                    true ?
                        <>
                            <Header user={true}/>
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
                                <Route path='*'>
                                    <NotFound/>
                                </Route>
                            </Switch>
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
