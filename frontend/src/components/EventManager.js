import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import PropTypes from "prop-types";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import {Button} from "@mui/material";


/**
 * Komponente, die das Erstellen von Events verwaltet.
 * Wird in andere Komponenten geladen, in denen jeweils der Event Typ angegeben wird.
 */
class EventManager extends Component {

    constructor(props) {
        super(props);


        this.state = {
            addPW : this.props.functionAddProjectWork,
            eventType: this.props.eventType,
            buttonName: '',
        }
    }

   /**
   * Wird aufgerufen, wenn ein Knopf zum Erstellen eines Ereignisses geklickt wird.
   * Ruft die Funktion addEvent auf und übergibt ihr den EventTyp, welcher in der jeweiligen Komponente angegeben ist.
   */
    handleCreateEventButtonClicked = (event) => {
        event.stopPropagation();
        // wenn der Event Typ 2 ist, wird das Ereignis und die Projektarbeit erstellt
        if (this.state.eventType === 2) {
            this.addEvent(this.state.eventType);
            this.state.addPW();
        }
        else {
             this.addEvent(this.state.eventType);
        }
    }

   /**
   * Erstellen eines Ereignisses.
   */
    addEvent = (event) => {
        let newEvent = new EventBO(event);
        console.log(this.state);
        HdMWebAppAPI.getAPI().addEvent(newEvent).then(event => {
            // Backend call successfull
            // reinit the dialogs state for a new empty customer
            this.setState(this.baseState);
            this.props.onClose(event); // call the parent with the customer object from backend
        }).catch(e =>
            console.log(e));
    }

   /**
   * Bestimmt den Namen des Knopfes zum Erstellen eines Ereignisses, je nach übergebenem Typ andere Benennung.
   */
    getNameofButton = () => {
        let bName = '';
        if (this.state.eventType === 1) {
            bName = 'Start buchen'
        } if (this.state.eventType === 2){
            bName = 'Ende buchen'
        } if (this.state.eventType === 3){
            bName = 'Pause starten'
        } if (this.state.eventType === 4){
            bName = 'Pause beenden'
        }
        this.setState({
            buttonName: bName
        });
    }

    componentDidMount() {
        this.getNameofButton();
    }

    render() {
        const { buttonName } = this.state

        return (
            <div>
                <Button eventType onClick={this.handleCreateEventButtonClicked}> {buttonName}</Button>
            </div>
        )
    }
}

/** PropTypes */
EventManager.propTypes = {

    onClose: PropTypes.func.isRequired,

}

export default EventManager;