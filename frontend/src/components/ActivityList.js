import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {ButtonGroup, Divider} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";


class ActivityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: []
        };
    };

    componentDidMount() {
        HdMWebAppAPI.getAPI().getActivities()
            .then(activitiesBOs =>
                this.setState({
                    activities: activitiesBOs
                })).catch(e =>
            this.setState({
                activities: []
            }));
        console.log(this.state.activities)
    }

    render() {
        return (
            <Box sx={{m: 2}}>
                <Card>
                    <Grid container spacing={1} justifyContent={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <ButtonGroup>
                                <Button variant={"contained"}>
                                    Projekt bearbeiten
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} align={"left"}>
                            <Typography variant={"h3"} component={"div"}>
                                Aktivität
                            </Typography>
                            <Typography variant={"h3"} component={"div"} align={"center"}>
                                Kapazität
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            {this.state.activities.map((activity) => (
                                <Box key={activity}>
                                    <ListItem>
                                        <Grid container justifyContent={"left"}>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} align={"left"}>
                                                <Typography variant={"h5"} component={"div"}>
                                                    {activity.capacity}
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

export default ActivityList;