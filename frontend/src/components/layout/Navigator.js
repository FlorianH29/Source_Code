import * as React from 'react';
import {Component} from 'react';
import {Box, CssBaseline, Divider, IconButton, Popover, AppBar, Drawer, Toolbar, Grid, Button} from '@mui/material';
import {Typography} from '@material-ui/core';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonDeleteDialog from "../dialogs/PersonDeleteDialog";
import PersonEditDialog from "../dialogs/PersonEditDialog";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import {Link as RouterLink} from "react-router-dom";
import {HdMWebAppAPI} from "../../api";
import EventManager from "../EventManager";
import Departure from "../Departure";
import MenuIcon from '@mui/icons-material/Menu';


class Navigator extends Component {


    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
            person: null,
            showPersonDelete: false,
            disableStartButton: false,
            disableEndButton: true,
            eventT: 0,
        };
    };

    /** Gibt zurück, ob eine Pause begonnen wurde */
    getBreakStarted = () => {
        this.setState({disableStartButton: false}, () => {
            HdMWebAppAPI.getAPI().getBreakStarted()
                .then(value => this.setState({
                    disableStartButton: value,
                    disableEndButton: !value
                }));
        });
    }

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
            }));
    }

    componentDidMount() {
        this.getAPerson();
        this.getBreakStarted();
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
        this.getBreakStarted();
    }

    render() {
        const {showPersonDeleteDialog, showPersonEditDialog, person, disableStartButton, disableEndButton, eventT} = this.state;
        const drawerWidth = 220;
        const lel = 0;
        const boxWidth = 200;

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

                    <Toolbar sx={{ justifyContent: "space-between" }}>

                            <Typography variant="h1" component="div" sx={{flexGrow: 1}}>
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


                                    <IconButton onClick={this.handleEdit}>
                                        <DriveFileRenameOutlineIcon style={{maxWidth: '20px', maxHeight: '20px',
                                            color: '#294F66'}}/>
                                       <Typography style={{fontWeight: '520', fontSize: '20'}}> Profil bearbeiten</Typography>
                                    </IconButton>
                                    <Divider sx={{p: 0}}/>
                                    <IconButton onClick={this.handleDelete} >
                                        <NoAccountsIcon style={{maxWidth: '21px', maxHeight: '21px', color: '#294F66'}}/>
                                       <Typography style={{fontWeight: '520', fontSize: '20'}}>Profil löschen</Typography>
                                    </IconButton>

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
                                    <ListItemButton component={RouterLink}
                                                    to={`/eventtransactionsandtimeintervaltransactions`}>
                                        <ListItemIcon style={{color: '#294F66' }}>
                                            <AccessTimeIcon/>
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography style={{fontWeight: 520}}>
                                            Arbeitszeiten</Typography>}/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton component={RouterLink} to={`/projects`}>
                                        <ListItemIcon style={{color: '#294F66' }}>
                                            <CardTravelIcon/>
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography style={{fontWeight: 520}}>
                                            Projekte</Typography>}/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton component={RouterLink} to={`/projectanalysis`}>
                                        <ListItemIcon style={{color: '#294F66' }}>
                                            <AssessmentRoundedIcon/>
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography style={{fontWeight: 520}}>
                                            Projektanalyse</Typography>}/>
                                    </ListItemButton>
                                </ListItem>

                                <Divider></Divider>

                                <ListItem style={{display:'flex', justifyContent:'center'}}>
                                    <EventManager  disabled={disableStartButton} eventT={3} onClose={this.handleClose}>
                                    </EventManager>
                                </ListItem>
                                <ListItem style={{display:'flex', justifyContent:'center'}}>
                                    <EventManager align={'center'} disabled={disableEndButton} eventT={4} onClose={this.handleClose}>
                                    </EventManager>
                                </ListItem>
                                <Departure></Departure>
                            </Typography>
                        </Drawer>
                    </>
                ) : null}
            </Box>
        )
    }
}

export default Navigator;
