import React, {Component} from 'react';
import {AppBar, Typography, Toolbar, IconButton, Menu, MenuList, Box} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuItem from "@mui/material/MenuItem";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class Header extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
            person: null
        };
    };



    handleOpenUserMenu = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleCloseUserMenu = () => {
        this.setState({anchorEl: null});
    };

    handleLogout = () => {
        this.handleCloseUserMenu();
        firebase.auth().signOut();
    }

    render() {
        const {person} = this.props;

        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position={"static"} sx={{bgcolor: "pink", p: 1}}>
                    <Toolbar>
                        <Typography variant='h3' component='div' sx={{flexGrow: 1}}>
                            HdM Zeiterfassung
                        </Typography>
                        {person ? (
                            <>
                                <IconButton
                                    size="large"
                                    onClick={this.handleOpenUserMenu}
                                    color="inherit">
                                    <PersonIcon/>
                                </IconButton>

                                <Menu
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={() => {
                                        this.handleCloseUserMenu()
                                    }}>
                                    <Typography variant='h11' component='h9' align='center'>
                                    <MenuList onClick={this.handleLogout}>Profil bearbeiten</MenuList>
                                    <MenuList onClick={this.handleLogout}>Profil löschen</MenuList>
                                    <MenuList onClick={this.handleLogout}>LogOut</MenuList>
                                    </Typography>

                                </Menu>
                            </>
                        ) : null}
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  }
});

export default Header;