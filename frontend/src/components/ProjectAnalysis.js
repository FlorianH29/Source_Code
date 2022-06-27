import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import {Box, Divider, Grid, TextField, Typography} from "@mui/material";
import ProjectAnalysisProjectEntry from "./ProjectAnalysisProjectEntry";
import {DatePicker, LocalizationProvider} from "@mui/lab";
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
        console.log(startDate)

        return (
            <div>
                { projects.length != 0 ? (
                <Box m={18} pl={8}>
                    <div align={"center"} style={{marginBottom: 10, marginTop: 20}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={"Start Date"}
                                value={startDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    this.setState({startDate: date.getTime()});

                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={"End Date"}
                                value={endDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    this.setState({endDate: date.getTime()});

                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <Grid container spacing={2}>

                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                Projekte: </Typography>
                        </Grid>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                Klient: </Typography>
                        </Grid>
                        <Grid item xs={4} align={"center"}>
                            <Typography variant={"h5"} component={"div"} style={{fontWeight: 600}}>
                                Arbeitsleistung: </Typography>
                        </Grid>
                    </Grid>
                    <Divider/>
                    {projects.map(pro =>
                        <ProjectAnalysisProjectEntry key={pro.getID()} project={pro}
                                                     startDate={startDate} endDate={endDate}/>)}
                </Box>) : (
                    <Box m={25} pl={15}>
                    <Typography variant={"h5"} >
                        Info: Da Sie in kein Projekt leiten, können Sie keine Projekte analysieren.
                    </Typography>
                    </Box>)}
            </div>
        );
    }
}

export default ProjectAnalysis;