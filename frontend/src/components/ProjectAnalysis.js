import React, {Component} from 'react';
import {HdMWebAppAPI} from "../api";
import PropTypes from "prop-types";
import {Box, Divider, Grid, TextField, Typography} from "@mui/material";
import ProjectListEntry from "./ProjectListEntry";
import ProjectAnalysisProjectEntry from "./ProjectAnalysisProjectEntry";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

class ProjectAnalysis extends Component {

    constructor(props) {
        super(props);

        // den state initialisieren
        this.state = {
            workTimeProject: null,
            projects: [],
            startDate: new Date().getTime(),
            endDate: new Date().getTime(),
        };

    }

    /** Gibt die Arbeitsleistung für ein Project in einen gegebenen Zeitraum zurück */
    getWorkTimeProject = () => {
        console.log(this.props.project)
        if (this.props.project.getID() > 0) {
            HdMWebAppAPI.getAPI().getProjectWorkTime(this.props.project.getID(), this.state.startDate, this.state.endDate).then(workTimeProject => this.setState({
                workTimeProject: workTimeProject,
            })).catch(e =>
                this.setState({ // bei Fehler den state zurücksetzen
                    workTimeProject: null,
                })
            );
        }
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
        // console.log(this.state.projects)
    }

    componentDidMount() {
        this.getProjects();
        //this.getWorkTimeActivity();
    }

    render() {
        const {startDate, endDate, projects} = this.state
        console.log(this.state.workTimeProject)

        return (
            <div>
                <Box m={18} pl={8}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={"Start Date"}
                            value={startDate}
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
                            onChange={(date) => {
                                this.setState({endDate: date.getTime()});

                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Grid container>

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

                </Box>
            </div>
        );
    }
}

/** PropTypes */
ProjectAnalysis.propTypes = {
    /** Das ProjectBO welches gerendert werden soll */
    project: PropTypes.object.isRequired,
    /** Das ActivityBO welches gerendert werden soll */
    activity: PropTypes.object.isRequired,
}

export default ProjectAnalysis;