import React, {Component} from 'react';
import {EventBO, HdMWebAppAPI} from '../api';
import {Box, Button} from '@material-ui/core';
import {Grid} from '@mui/material';


/**
 * Komponente, die das Erstellen von Events verwaltet.
 * Wird in andere Komponenten geladen, in denen jeweils der Event Typ angegeben wird.
 */
class EventManager extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonName: '',
            disabled: this.props.disabled,
        }
    }

    /**
     * Wird aufgerufen, wenn ein Knopf zum Erstellen eines Ereignisses geklickt wird. Ruft die Funktion addEvent auf und
     * übergibt ihr 0 als Zeitstempel und den EventTyp, welcher in der jeweiligen Komponente angegeben ist.
     */
    handleCreateEventButtonClicked = () => {
        this.addEvent(0, this.props.eventT);
    }

    /**
     * Erstellen eines Ereignisses.
     */
    addEvent = async (timeStamp, eventT) => {
        let newEvent = new EventBO(timeStamp, eventT);
        // console.log(this.state);
        await HdMWebAppAPI.getAPI().addEvent(newEvent).then(event => {
            // Backend call successfull
            this.props.onClose(event);
        }).catch(e =>
            console.log(e));
    }

    /**
     * Bestimmt den Namen des Knopfes zum Erstellen eines Ereignisses, je nach übergebenem Typ andere Benennung.
     */
    getNameofButton = () => {
        let bName = '';
        if (this.props.eventT === 1) {
            bName = 'Start buchen'
        }
        if (this.props.eventT === 2) {
            bName = 'Ende buchen'
        }
        if (this.props.eventT === 3) {
            bName = 'Pause starten'
        }
        if (this.props.eventT === 4) {
            bName = 'Pause beenden'
        }
        this.setState({
            buttonName: bName
        });
    }

    componentDidMount() {
        this.getNameofButton();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props) {
            this.setState({disabled: this.props.disabled})
        }
    }


    render() {
        const { eventT } = this.props
        const {buttonName, disabled} = this.state

        return (
            <div>
                <Grid container >
                    <Grid  >

                        <Button variant='contained' color='primary' disabled={disabled} ml={3}
                                onClick={this.handleCreateEventButtonClicked}> {buttonName}
                        </Button>

                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default EventManager;