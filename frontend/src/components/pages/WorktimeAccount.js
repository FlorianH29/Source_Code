import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";

class WorktimeAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: []
        };

    };

    componentDidMount() {
        const response = [1,2,3,4,5]
        this.setState({projects: response});
        console.log(this.state.projects)
    }

    render() {
        return (
            <Box sx={{m: 2}}>
                <Card>
                    <Grid container spacing={1} justifyContent={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <ButtonGroup>
                                <Button variant={"contained"}>
                                    Meine Projekte
                                </Button>
                                <Button variant={"contained"}>
                                    Neues Projekt anlegen
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <Typography variant={"h3"} component={"div"}>
                                Worktimeaccount
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            {this.state.projects.map((project) => (
                                <ListItem key = {project}>
                                    <p>
                                        {project}
                                    </p>
                                </ListItem>))}
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        )

    }
}

export default WorktimeAccount;