import React, {Component} from 'react';
import {AppBar, Box, IconButton, Menu, MenuList, Toolbar, Typography} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class Header extends Component {

    constructor(props) {
        super(props);

        // Initiiere einen leeren state
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
                                    <Typography variant='h11' component='h5' align='center'>
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

/** Komponentenspezifische Styles */
const styles = theme => ({
  root: {
    width: '100%',
  }
});

export default Header;