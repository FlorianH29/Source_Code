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
        HdMWebAppAPI.getAPI().getProjectWorks(1)
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
        console.log(this.state.projectWorks)
    }

    render() {
        return (
            <div>
                <Grid container spacing={1} justify='flex-start' alignItems='center'>
                    <Grid item xs={12} align={"center"}>
                            {this.state.projectWorks.map((pw) => (
                                <Box key={pw}>
                                    <ListItem>
                                        <Grid container justifyContent={"left"}>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {pw.project_work_name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"left"}>
                                                 <Typography variant={"h5"} component={"div"}>
                                                    {pw.description}
                                                 </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider/>
                                </Box>
                            ))}
                        </Grid>
                </Grid>
                {

                }
            </div>
        );

    }

}

export default ProjectWorkList;