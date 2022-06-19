import * as React from 'react';
import {AppBar, CssBaseline, Typography, Toolbar, IconButton, Menu, Box, Drawer, Button, Link, Divider} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Component} from "react";
import PersonDeleteDialog from "../dialogs/PersonDeleteDialog";
import PersonEditDialog from "../dialogs/PersonEditDialog";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import {Link as RouterLink} from "react-router-dom";
import {HdMWebAppAPI, PersonBO} from "../../api";


class Navigator extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
            person: null,
            showPersonDelete: false
        };
    };


  persondeleteClosed = person => {
    // Person ist nicht null und deshalb erstelltI/überarbeitet
    if (person) {
      const newperson = [...this.state.person, person];
      this.setState({
        person: newperson,
        showPersonDeleteDialog: false
      });
    } else {
        this.setState({
          showPersonDeleteDialog: false
        });
      }
  }

  getPerson = () => {
    HdMWebAppAPI.getAPI().getPerson()
      .then(customerBOs =>
        this.setState({
          person: PersonBO,
          error: null
        })).catch(e =>
          this.setState({
            person: [],
            error: e
          })
        );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      error: null
    });
  }

    handleDelete = () => {
        this.setState({
            showPersonDeleteDialog: true
        });
    }

     handleEdit = () => {
        this.setState({
            showPersonEditDialog: true
        });
    }

      personeditClosed = person => {
    // person ist nicht null und deshalb überarbeitet
    if (person) {
      const newperson = [...this.state.person, person];
      this.setState({
        person: newperson,
        showPersonEditDialog: false
      });
    } else {
        this.setState({
          showPersonEditDialog: false
        });
      }
  }

    handleOpenUserMenu = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleCloseUserMenu = () => {
        this.setState({anchorEl: null});
    };


  handleClose = () => {
      // den state neu setzen, sodass open false ist und der Dialog nicht mehr angezeigt wird
      this.setState({open: false});
  }

    render() {
        const {person} = this.props;
        const {showPersonDeleteDialog, showPersonEditDialog} = this.state;
        const drawerWidth = 200;
        const lel = 0;
        const boxWidth = 200;



        return (
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="static" sx={{width: `calc(100% - ${lel}px)`, bgcolor: "#05353f", ml: `${boxWidth}px`, p:4}}>
                    <Toolbar>
                        <Typography variant="h3"  component="div" sx={{flexGrow: 1}}>
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
                                    <PersonDeleteDialog person={person} show={showPersonDeleteDialog} onClose={this.persondeleteClosed}>
                                    </PersonDeleteDialog>
                                    <PersonEditDialog person={person} show={showPersonEditDialog} onClose={this.personeditClosed}>
                                    </PersonEditDialog>
                                    <Typography variant='h5' component='div' align='center'>
                                    <Button onClick={this.handleEdit}>Profil bearbeiten</Button>
                                    <Button onClick={this.handleDelete}>Profil löschen</Button>
                                    </Typography>
                                </Menu>

                  <Drawer variant="permanent" top={100} position = "relative" anchor="left"
                        sx={{width: drawerWidth, flexShrink: 2, '& .MuiDrawer-paper': {width: drawerWidth,
                                flexGrow: 1, boxSizing: 'border-box', bgcolor: "white"
                        },
                    }}>
                       <Divider sx={{p:7.95, bgcolor:"#05353f"}} />
                       <Typography variant="h3"  component="div" sx={{flexGrow: 1, p:1}}>
                            <ListItem>
                                 <ListItemButton component={RouterLink} to={`/persons`}>
                                     <ListItemIcon>
                                        <PersonSearchIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Personen" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem>
                                 <ListItemButton component={RouterLink} to={`/projectworks`}>
                                     <ListItemIcon>
                                        <AccessTimeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Projekte" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem>
                                 <ListItemButton component={RouterLink} to={`/worktimeaccount`}>
                                     <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Arbeitszeiten" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem>
                                 <ListItemButton component={Link} to={`https://www.instagram.com/p/CdnFHnzj8UP/`} >
                                     <ListItemIcon>
                                        <SportsSoccerIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Blöder Kerle" />
                                </ListItemButton>
                            </ListItem>
                      </Typography>
                  </Drawer>
                     </>
                    ) : null}
                </Toolbar>
            </AppBar>
        </Box>
        )
    }
}

export default Navigator;