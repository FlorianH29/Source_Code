import * as React from 'react';
import {AppBar, CssBaseline, Popover, Typography, Toolbar, IconButton, Box, Drawer, Button, Link, Divider} from '@mui/material';
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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import {Link as RouterLink} from "react-router-dom";
import {HdMWebAppAPI, PersonBO} from "../../api";
import EventManager from "../EventManager";


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

    getAPerson = () => {
        HdMWebAppAPI.getAPI().getPerson()
            .then(personBO =>
                this.setState({
                    person: personBO,
                })).catch(e =>
            this.setState({
                person: null,
            })
        );
    }

    componentDidMount() {
        this.getAPerson();
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

    personEditClosed = (person) => {
        // person ist nicht null und deshalb überarbeitet
        if (person) {
            this.setState({
                person: person,
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
        const {showPersonDeleteDialog, showPersonEditDialog, person} = this.state;
        const drawerWidth = 200;
        const lel = 0;
        const boxWidth = 200;
        //console.log(person)

        return (
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="fixed" sx={{
                    width: `calc(100% - ${lel}px)`,
                    bgcolor: "#05353f",
                    ml: `${boxWidth}px`,
                    p: 4,
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}>
                    <Toolbar>
                        <Typography variant="h3" component="div" sx={{flexGrow: 1}}>
                            HdM Zeiterfassung
                        </Typography>
                    {person ? (<>
                        <IconButton
                            size="large"
                            onClick={this.handleOpenUserMenu}
                            color="inherit">
                            <ManageAccountsIcon/>
                        </IconButton>
                        <Popover
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
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
                            <PersonDeleteDialog person={person} show={showPersonDeleteDialog}
                                                onClose={this.persondeleteClosed}>
                            </PersonDeleteDialog>
                            <PersonEditDialog person={person} show={showPersonEditDialog}
                                              onClose={this.personEditClosed}>
                            </PersonEditDialog>

                            <Typography variant='h6' component='div' align='left'>
                                <IconButton onClick={this.handleEdit}>
                                <DriveFileRenameOutlineIcon/>
                                Profil bearbeiten
                                </IconButton>
                                <Divider sx={{p: 0}}/>
                                <IconButton onClick={this.handleDelete}>
                                <NoAccountsIcon/>
                                Profil löschen
                                </IconButton>
                                </Typography>
                        </Popover>
                         </>) : null
                    }
                     </Toolbar>
                </AppBar>

                {person ? (
                    <>
                        <Drawer variant="permanent" top={100} position="relative" anchor="left"
                                sx={{
                                    width: drawerWidth, flexShrink: 2, '& .MuiDrawer-paper': {
                                        width: drawerWidth,
                                        flexGrow: 1, boxSizing: 'border-box', bgcolor: "white"
                                    },
                                }}>
                            <Divider sx={{p: 7.95, bgcolor: "#05353f"}}/>
                            <Typography variant="h3" component="div" sx={{flexGrow: 1, p: 1}}>
                                <ListItem>
                                    <ListItemButton component={RouterLink} to={`/persons`}>
                                        <ListItemIcon>
                                            <PersonSearchIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Personen"/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton component={RouterLink} to={`/projectworks`}>
                                        <ListItemIcon>
                                            <AccessTimeIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Projekte"/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton component={RouterLink} to={`/worktimeaccount`}>
                                        <ListItemIcon>
                                            <AccountCircleIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Arbeitszeiten"/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <EventManager eventType={3} onClose={this.handleClose}>
                                    </EventManager>
                                </ListItem>

                                <ListItem>
                                    <EventManager eventType={4} onClose={this.handleClose}>
                                    </EventManager>
                                </ListItem>
                            </Typography>
                        </Drawer>
                    </>
                ) : null}
            </Box>
        )
    }
}

export default Navigator;