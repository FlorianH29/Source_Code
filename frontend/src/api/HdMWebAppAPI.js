import PersonBO from './PersonBO';
import ProjectBO from './ProjectBO';
import WorktimeAccountBO from "./WorktimeAccountBO";
import ActivityBO from "./ActivityBO";
import ProjectWorkBO from "./ProjectWorkBO";
import TimeIntervalBO from "./TimeIntervalBO";

export default class HdMWebAppAPI {

    // Singelton instance
    static #api = null;


    // Local Python backend
    #hdmwebappServerBaseURL = '/hdmwebapp';

  // Person bezogen
  #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;

  //Projekt bezogen
  #getProjectsURL = () => `${this.#hdmwebappServerBaseURL}/projects`;

    //Worktimeaccount bezogen
    #getWorktimeAccountURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}`;

  //Activity bezogen
  #getActivitiesURL = () => `${this.#hdmwebappServerBaseURL}/activities`;

    /**
     * Get the Singelton instance
     *
     * @public
     */
    static getAPI() {
        if (this.#api == null) {
            this.#api = new HdMWebAppAPI();
        }
        return this.#api;
    }

    // Projektarbeit bezogen
    #getProjectWorksforActivityURL = (id)  => `${this.#hdmwebappServerBaseURL}/'/activities/${id}/projectworks'`;

    /**
    * Get the Singelton instance
    *
    * @public
    */
    static getAPI() {
      if (this.#api == null) {
        this.#api = new HdMWebAppAPI();
      }
      return this.#api;
    }

    /**
     *  Returns a Promise which resolves to a json object.
     *  The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
     *  fetchAdvanced throws an Error also an server status errors
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
        .then(res => {
                // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
                if (!res.ok) {
                    throw Error(`${res.status} ${res.statusText}`);
                }
                return res.json();
            }
        )

    getPersons() {
        return this.#fetchAdvanced(this.#getPersonsURL()).then((responseJSON) => {
            let personBOs = PersonBO.fromJSON(responseJSON);
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(personBOs);
            })
        })
    }

    getWorktimeAccount(id) {
        return this.#fetchAdvanced(this.#getWorktimeAccountURL(id)).then((responseJSON) => {
            let worktimeaccountBOs = WorktimeAccountBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(worktimeaccountBOs);
            })
        })
    }

    getActivities() {
        return this.#fetchAdvanced(this.#getActivitiesURL()).then((responseJSON) => {
            let activitiesBO = ActivityBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(activitiesBO);
            })
        })
    }

    getProject() {
        return this.#fetchAdvanced(this.#getProjectsURL()).then((responseJSON) => {
            let projectBOs = ProjectBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(projectBOs);
            })
        })
    }
    getWorktimeAccount(id) {
        return this.#fetchAdvanced(this.#getWorktimeAccountURL(id)).then((responseJSON) => {
            let worktimeaccountBOs = WorktimeAccountBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(worktimeaccountBOs);
            })
        })
    }

    getProject() {
        return this.#fetchAdvanced(this.#getProjectsURL()).then((responseJSON) => {
            let projectBOs = ProjectBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(projectBOs);
            })
        })
    }

    getProjectWorks(id) {
        return this.#fetchAdvanced(this.#getProjectWorksforActivityURL(id)).then((responseJSON) => {
            let projectworkBOs = ProjectWorkBO.fromJSON(responseJSON);
            // console.log(projectworkBOs);
            return new Promise(function (resolve) {
                resolve(projectworkBOs);
            })
        })
    }
}