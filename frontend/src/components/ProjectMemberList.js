import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear'
import {withRouter} from 'react-router-dom';
import {HdMWebAppAPI} from '../api';


class ProjectMemberList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectMembers: [],
        };
    };

    getProjectMembers = () => {
        HdMWebAppAPI.getAPI().getProjectMembers(1)  // statt 1 sollte hier die Id der ausgewählten Person rein
            .then(personBOs =>
                this.setState({
                    projectMembers: personBOs
                })).catch(e =>
            this.setState({
                projectMembers: []
            }));
    }

    componentDidMount() {
        this.getProjectMembers();
    }


}