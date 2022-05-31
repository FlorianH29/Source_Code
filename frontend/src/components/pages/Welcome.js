import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {HdMWebAppAPI} from "../../api";


class Welcome extends Component {

    render() {
        return (
             <Box sx={{m: 2, b: 2, p: 2}}>
                <Card>
                    <Grid container spacing={2} justifyContent={"center"}  alignItems={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <h2>Wilkommen, {this.props.username}</h2>
                            <p>Bitte bestätige deinen Arbeitsbeginn:</p>
                            <Button variant={"contained"} color="success">
                                    Kommen
                            </Button>
                            <p></p>
                        </Grid>
                    </Grid>
                </Card>
             </Box>
        );
    }
}


export default Welcome;