import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@mui/material/ListItem";
import Checkbox from '@mui/material/Checkbox';


class CheckboxListEntry extends Component {

    constructor(props) {
        super(props);

        // den State initialisieren
        this.state = {
            potentialProjectMember: props.potentialProjectMember,
            checked: false
        };
    }

    handleCheckboxChanged = (value) => {
        this.setState({checked: value.target.checked})
        console.log(value.target.checked)
            if (value.target.checked) {
                this.props.addPerson (this.state.potentialProjectMember)
            }
                else {
                    this.props.removePerson (this.state.potentialProjectMember)
            }
    }

    render() {
        const {potentialProjectMember, checked} = this.state;
        console.log(this.state)

        return (
            <div>
                <ListItem>
                    <Checkbox
                        edge="start"
                        hecked={checked}
                        onChange={this.handleCheckboxChanged}
                    />
                        {potentialProjectMember.getFirstName()} {potentialProjectMember.getLastName()}
                </ListItem>
            </div>
        );
    }
}

CheckboxListEntry.propTypes = {
    potentialProjectMember: PropTypes.object.isRequired,
}

export default CheckboxListEntry;