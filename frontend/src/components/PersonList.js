import React, {Component} from 'react';
import {HdMWebAppAPI} from '../api';
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from '@mui/material';

class PersonList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            persons: []
        }
    }

    componentDidMount() {
        this.getPersons();
    }

    getPersons = () => {
        HdMWebAppAPI.getAPI().getPersons()
            .then(personBOs =>
                this.setState({
                    persons: personBOs
                })).catch(e =>
            this.setState({
                persons: []
            }));
        //console.log(this.state.persons)
    }

    render() {
        return (
            <div>
                <Grid container spacing={1} justify='flex-start' alignItems='center'>
                    <Grid item>
                        <Typography>
                            Filter person list by name:
                        </Typography>
                    </Grid>
                </Grid>
                {

                }
            </div>
        );

    }

}

export default PersonList;