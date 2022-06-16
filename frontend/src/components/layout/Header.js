import React, {Component} from 'react';
import {AppBar, Typography, Toolbar, IconButton, Menu, MenuList, Box, Drawer, Link} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {Link as RouterLink} from "react-router-dom";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonDeleteDialog from './dialogs/PersonDeleteDialog';

class Header extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
            person: null,
            showPersonDelete: false
        };
    };




  handleStartEventButtonClicked = (event) => {
    // Dialog öffnen, um damit ein Startevent anlegen zu können
      event.stopPropagation();
      this.setState({
          open: true
      })
  }
  persondeleteClosed = person => {
    // projectWork ist nicht null und deshalb erstelltI/überarbeitet
    if (person) {
      const newperson = [...this.state.person, person];
      this.setState({
        projectWorks: newperson,
        showPersonDeleteDialog: false
      });
    } else {
        this.setState({
          showPersonDeleteDialog: false
        });
      }
  }

    handleDelete = (event) => {
        this.setState({
            showPersonDeleteDialog: true
        });
    }


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

  handleClose = () => {
      // den state neu setzen, sodass open false ist und der Dialog nicht mehr angezeigt wird
      this.setState({open: false});
  }
    render() {
        const {person, showPersonDeleteDialog} = this.props;


        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position={"static"} sx={{bgcolor: "#05353f", p: 1}}>
                    <Toolbar>
                        <Typography variant='h3' component='div' sx={{flexGrow: 1}}>
                            HdM Zeiterfassung
                        </Typography>

                <Drawer
                class={Drawer}
                variant={"permanent"}
                anchor={"left"}

                >
                        <Typography variant='h3' component='div' sx={{flexGrow: 1}}>

                            <AssignmentIndIcon fontSize={"lage"}>

                            </AssignmentIndIcon>

                        </Typography>
                </Drawer>
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
                                    <MenuList onClick={this.handleDelete}>Profil löschen</MenuList>
                                    <MenuList onClick={this.handleLogout}>LogOut</MenuList>
                                    </Typography>

                                </Menu>
                            </>
                        ) : null}
                    </Toolbar>
                </AppBar>
                 <PersonDeleteDialog person={person} show={showPersonDeleteDialog} onClose={this.persondeleteClosed}>
                                    </PersonDeleteDialog>
            </Box>
        )
    }
}


/** Component specific styles */
//const styles = theme => ({
 //root: {
  //width: '100%',
  //}
//});

export default Header;