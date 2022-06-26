import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityBO, HdMWebAppAPI} from "../../api";
import CheckboxListEntry from "../CheckboxListEntry";
import {List} from "@mui/material";



class CheckboxForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            potentialProjectMembers: [],
            selectedPerson: [],
        }
    }

    getPotentialMembersForProject = () => {
        HdMWebAppAPI.getAPI().getPersonsNotProjectMembersOfProject(1)  // statt 1 sollte hier die Id des ausgewählten Projekts rein
            .then(personBOs => {
                console.log(personBOs)
                this.setState({
                    potentialProjectMembers: personBOs
                })}).catch(e =>
            this.setState({
                potentialProjectMembers: []
            }));
    }

    addSelectedPersonsToProject = () => {
    let newProjectMembers = new PersonBO(this.state.selectedPerson);
    console.log(newProjectMembers);
    HdMWebAppAPI.getAPI().addPersonAsProjectMember(newProjectMembers).then(person => {
      // Backend call erfolgreich
      this.setState(this.baseState);
      this.props.onClose(person); // call the parent with the customer object from backend
    }).catch(e =>
      console.log(e)
    );
    }

    componentDidMount() {
        this.getPotentialMembersForProject();
    }

    setSelectedPersons = (ppm) => {
        this.state.selectedPerson.push(ppm)
        console.log(this.state.selectedPerson)
    }

    removeSelectedPersons = (ppm) => {
        this.state.selectedPerson.splice(this.state.selectedPerson.indexOf(ppm), 1)
        console.log(this.state.selectedPerson)
    }


    render() {
        const {potentialProjectMembers, selectedPerson} = this.state;
        console.log(potentialProjectMembers)

        return (
            <div>
                 <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                     {potentialProjectMembers.map((value) =>
                        <CheckboxListEntry potentialProjectMember = {value} key = {value}
                            addPerson = {this.setSelectedPersons}
                            removePerson = {this.removeSelectedPersons}/>)}
                 </List>

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
