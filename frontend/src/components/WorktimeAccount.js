import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import {ButtonGroup, Divider} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import {HdMWebAppAPI} from "../api";
import ProjectWorkForm from "./dialogs/ProjectWorkForm";
import ProjectList from './ProjectList';
import ProjectWorkListEntry from "./ProjectWorkListEntry";

class WorktimeAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            worktimeaccounts: [],
            projects: []
        };

    };

    componentDidMount() {
        HdMWebAppAPI.getAPI().getWorktimeAccount(2)
            .then(worktimeaccountBOs =>
                this.setState({
                    worktimeaccounts: worktimeaccountBOs
                })).catch(e =>
            this.setState({
                worktimeaccounts: []
            }));
        console.log(this.state.worktimeaccounts)
    }

    handleButton = () => {
        this.props.history.push('/worktimeaccount')
    }

    render() {
        const {projects} = this.state;
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
                        <Grid item xs={6} align={"center"}>
                            <Typography variant={"h3"} component={"div"}>
                                Projekte
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align={"center"}>
                            <Typography variant={"h3"} component={"div"}>
                                Zeiten
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            {this.state.worktimeaccounts.map((project) => (
                                <Box key={project}>
                                    <ListItem>
                                        <Grid container justifyContent={"center"}>
                                            <Grid item xs={6} align={"center"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {project.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"center"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {project.time}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider/>
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        )

    }
}

export default WorktimeAccount;