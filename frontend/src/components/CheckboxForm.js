import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField} from '@material-ui/core';
import {HdMWebAppAPI, PersonBO} from "../../api";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import {Divider} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import ProjectMemberForm from "./dialogs/ProjectMemberForm";


class CheckboxForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            potentialProjectMembers: []
        }

    }

    getPotentialMembersForProject = () => {
        HdMWebAppAPI.getAPI().getPersonsNotProjectMembersOfProject(1)  // statt 1 sollte hier die Id des ausgewählten Ptojekts rein
            .then(personBOs =>
                this.setState({
                    potentialProjectMembers: personBOs
                })).catch(e =>
            this.setState({
                potentialProjectMembers: []
            }));
    }

    componentDidMount() {
        this.getPotentialMembersForProject();
    }

    render() {
        const checkboxList = [potentialProjectMembers.getFirstName(), potentialProjectMembers.getLastName()]
        const [person, setName] = React.useState < string[] > ([]);

        const handleChange = (event: SelectChangeEvent<typeof person>) => {
            const {
                target: {value},
            } = event;
            setName(
                // On autofill we get a stringified value.
                typeof value === 'string' ? value.split(',') : value,
            );
        };

        return (

            <div>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="multiple-checkbox-person">Tag</InputLabel>
                    <Select
                        labelId="multiple-checkbox-person"
                        id="person-checkbox"
                        multiple
                        value={person}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag"/>}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {checkboxList.map((persons) => (
                            <MenuItem key={persons} value={persons}>
                                <Checkbox checked={person.indexOf(persons) > -1}/>
                                <ListItemText primary={persons}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

        )

    }


}

CheckboxForm.propTypes = {
    /** @ignore */
    projectMember: PropTypes.object.isRequired,
    person: PropTypes.object.isRequired,
    /** The CustomerBO of this AccountList */
    project: PropTypes.object.isRequired,
}


export default CheckboxForm;