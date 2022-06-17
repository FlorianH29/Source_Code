import React, {Component} from 'react';
import {AppBar, Typography, Toolbar, IconButton, Menu, Tab, Tabs, Box, Drawer, Button, MenuItem} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {Link as RouterLink} from "react-router-dom";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonDeleteDialog from "../dialogs/PersonDeleteDialog";

class Header extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
            person: null,
        };
    };

    render() {
        const {person} = this.props;
        const {showPersonDeleteDialog} = this.state;

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