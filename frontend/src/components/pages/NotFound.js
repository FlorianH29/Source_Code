import React, {Component} from 'react';
import logo from './404_unicorn.png'; //
import {Box, Button, Grid} from '@mui/material';
import { withRouter } from "react-router";

class NotFound extends Component {

      handleButton = () => {
         this.props.history.push('/worktimeaccount')
  }

    render() {
        return (
            <>
                <Grid container spacing={1} justifyContent={"center"}>
                    <Grid item xs={12} align={"center"}>
                        <Box component="img" src={logo} sx={{width: "100%"}}/>
                    </Grid>
                    <Grid item xs={12} align={"center"}>
                        <Button variant={"contained"} sx={{bgcolor: "pink"}} onClick={this.handleButton}>
                            Back to Home
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default withRouter(NotFound);