import React, {Component} from 'react';
import {HdMWebAppAPI} from '../../api';
import {withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography, Divider} from '@mui/material';
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";

class ProjectWorkList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectWorks: []
        }
    }

    getProjectWorksForActivity = () => {
        HdMWebAppAPI.getAPI().getProjectWorks(1)  // statt 1 sollte hier die Id der ausgewählten Aktivität rein
            .then(projectWorkBOs =>
                this.setState({
                    projectWorks: projectWorkBOs
                })).catch(e =>
            this.setState({
                projectWorks: []
            }));
    }

    componentDidMount() {
        this.getProjectWorksForActivity();
    }

    render() {
        // const { classes, expandedState } = this.props;
        const { projectWorks } = this.state;
        console.log(this.state)

        return (
            <div>
                <Grid container>
                    <Grid item xs={12} align={"center"}>
                        <Grid container>
                            <Grid item xs={4} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Projektarbeit </Typography>
                            </Grid>
                            <Grid item xs={4} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Beschreibung </Typography>
                            </Grid>
                            <Grid item xs={4} align={"flex-end"}>
                                <Typography variant={"h5"} component={"div"}> Dauer </Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        {projectWorks.map((pw) => (
                            <Box key={pw}>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={4} align={"center"}>
                                            <Typography variant={"h5"} component={"div"}>
                                                {pw.getProjectWorkName()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} align={"center"}>
                                            <Typography variant={"h5"} component={"div"}>
                                                {pw.getDescription()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} align={"center"}>
                                            <Typography variant={"h5"} component={"div"}>
                                                {pw.getTimeIPeriod()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider/>
                            </Box>
                            ))}
                        <Grid container direction={'row'} spacing={18}>
                            <Grid item xs={6} align={'center'}>
                                <Button variant='contained' color='primary' onClick={this.handleSignInButtonClicked}>
							        Start buchen
      					        </Button>
                            </Grid>
                            <Grid item xs={6} align={'center'}>
                                <Button variant='contained' color='primary' onClick={this.handleSignInButtonClicked}>
							        Ende buchen
      					        </Button>
                            </Grid>
					    </Grid>
                    </Grid>
                </Grid>
                {

                }
            </div>
        );

    }

}

export default ProjectWorkList;