import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@mui/material/ListItem";
import {Typography} from "@mui/material";


class CheckboxListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            potentialProjectMember: props.potentialProjectMember
        };
    }

    render() {
        const {potentialProjectMember} = this.state;
        console.log(this.state)

        return (
            <div>
                <ListItem>
                        {potentialProjectMember.firstname} {potentialProjectMember.lastname}
                </ListItem>
            </div>
        );
    }
}

CheckboxListEntry.propTypes = {
    potentialProjectMember: PropTypes.object.isRequired,
}

export default CheckboxListEntry;