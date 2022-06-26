import React, {Component} from 'react';
import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class Header extends Component {

    constructor(props) {
        super(props);

        // Initiiere einen leeren state
        this.state = {
            anchorEl: null,
            person: null,
        };
    };

    render() {
        const {person} = this.props;
        const {} = this.state;

        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position={"static"} sx={{bgcolor: "#05353f", p: 4}}>
                    <Toolbar>
                        <Typography variant='h3' component='div' sx={{flexGrow: 1}}>
                            HdM Zeiterfassung
                        </Typography>

                        {person ? (
                            <>
                            </>
                        ) : null}
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}



export default Header;