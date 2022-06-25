import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@mui/material/ListItem";


class CheckboxListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            projectMembers: props.projectMembers
        };
    }

    render() {
        const {projectMembers} = this.state;

        return (
            <div>
                <ListItem>
                    {projectMembers.getFirstName()} {projectMembers.getLastName()}
                </ListItem>
            </div>
        );
    }
}

CheckboxListEntry.propTypes = {
    projectMembers: PropTypes.object.isRequired,
}

export default CheckboxListEntry;