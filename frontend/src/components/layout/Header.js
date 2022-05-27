import React, {Component} from 'react';
import {AppBar, Typography, Toolbar, IconButton, Menu, Box} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuItem from "@mui/material/MenuItem";


class Header extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            anchorEl: null,
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

    }

    render() {
        const { user } = this.props;

        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position={"static"} sx={{bgcolor: "pink", p: 1}}>
                    <Toolbar>
                        <Typography variant='h3' component='div' sx={{flexGrow: 1}}>
                            HdM Web App
                        </Typography>
                        {user ? (
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
                                    onClose={() => {this.handleCloseUserMenu()}}>

                                    <MenuItem onClick={this.handleLogout}>LogOut</MenuItem>
                                </Menu>
                            </>
                        ):null}
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }

}

export default Header;