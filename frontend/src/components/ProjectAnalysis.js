import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import {Divider, TextField, Typography} from '@material-ui/core';
import {Card, Grid, Box} from '@mui/material'
import ProjectAnalysisProjectEntry from "./ProjectAnalysisProjectEntry";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

class ProjectAnalysis extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            projects: [],
            startDate: new Date('2022/01/01').getTime(),
            endDate: new Date().getTime(),
        };

    }

    /** Gibt die Projekte einer Person zurück, in denen sie Projektleiter ist.*/
    getProjects = () => {
        HdMWebAppAPI.getAPI().getProjectsByOwner()
            .then(projectBOs =>
                this.setState({
                    projects: projectBOs
                })).catch(e =>
            this.setState({
                projects: []
            }));
    }

    componentDidMount() {
        this.getProjects();
    }

    render() {
        const {startDate, endDate, projects} = this.state

        return (
            <div>
                {projects.length != 0 ? (
                    <Box mt={18} ml={21} mr={2} mb={10} pl={8}>
                        <Card>
                            <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                                <Grid container spacing={3}>
                                    <Grid item xs={5} align={"right"}>

                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label={"Start-Datum"}
                                                value={startDate}
                                                inputFormat="dd/MM/yyyy"
                                                onChange={(date) => {
                                                    this.setState({startDate: date.getTime()});
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={7} align={"left"}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label={"End-Datum"}
                                                value={endDate}
                                                inputFormat="dd/MM/yyyy"
                                                onChange={(date) => {
                                                    this.setState({endDate: date.getTime()});

                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>

                                    </Grid>
                                </Grid>

                            </div>
                            <Grid container spacing={2} pt={3}>

                                <Grid item xs={4} align={"center"}>
                                    <Typography variant={"h2"} component={"div"}>
                                        Projekte </Typography>
                                </Grid>
                                <Grid item xs={4} align={"center"}>
                                    <Typography variant={"h2"} component={"div"}>
                                        Klient </Typography>
                                </Grid>
                                <Grid item xs={4} align={"center"}>
                                    <Typography variant={"h2"} component={"div"}>
                                        Arbeitsleistung </Typography>
                                </Grid>
                            </Grid>
                            <Divider/>
                            {projects.map(pro =>
                                <ProjectAnalysisProjectEntry key={pro.getID()} project={pro}
                                                             startDate={startDate} endDate={endDate}/>)}
                        </Card>
                    </Box>) : (
                    <Box m={25} pl={15}>
                        <Typography variant={"h5"}>
                            Info: Da Sie kein Projekt leiten, können Sie keine Projekte analysieren.
                        </Typography>
                    </Box>)}
            </div>
        );
    }
}

export default ProjectAnalysis;