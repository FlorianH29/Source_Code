import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {HdMWebAppAPI} from "../../api";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CheckboxListEntry from "../CheckboxListEntry";


class CheckboxForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            potentialProjectMembers: [],
            name: []
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




    handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName()
        {
         typeof value === 'string' ? value.split(',') : value
    }
    };


    render() {
        const {potentialProjectMembers, name} = this.state;

        return (
            <div>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="multiple-checkbox-person">Mitarbeiter</InputLabel>
                    <Select
                        labelId="multiple-checkbox-person"
                        id="person-checkbox"
                        multiple
                        value={name}
                        onChange={this.handleChange}
                        input={<OutlinedInput label="Tag"/>}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {potentialProjectMembers.map(ppm => (
                            <CheckboxListEntry potentialProjectMember={ppm}>
                                <MenuItem key={ppm} value={ppm}/>
                                <Checkbox checked={potentialProjectMembers.indexOf(ppm) > -1}/>
                                <ListItemText primary={ppm}/>
                            </CheckboxListEntry>))
                        }
                    </Select>
                </FormControl>
            </div>
        )
    }
}

CheckboxForm.propTypes = {
     /** @ignore */
     projectMembers: PropTypes.object.isRequired,
     person: PropTypes.object.isRequired,
     /** The CustomerBO of this AccountList */
     project: PropTypes.object.isRequired,
}


export default CheckboxForm;
