import React, {Component} from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

class ActivityCreateDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.baseState = this.state;
    }

    handleClose = () => {
        // den state neu setzen, sodass man wieder auf dem Stand ist wie vor dem Dialog
        this.setState(this.baseState);
        this.props.onClose(null);
    }

    render() {

        let header = '';
        let title = '';

        header = 'Geben Sie Name und Kapazität der Aktivität an';
        title = 'Neue Aktivität erstellen';

        return (
            show ?
                <Dialog open={true} onClose={this.handleClose} maxWidth='xs'>
                    <DialogTitle id='form-dialog-title'>{title}
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                :
                null
        )
    }
}

export default ProjectWorkDeleteDialog;