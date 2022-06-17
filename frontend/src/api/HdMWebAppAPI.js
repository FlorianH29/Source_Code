import PersonBO from './PersonBO';
import ProjectBO from './ProjectBO';
import WorktimeAccountBO from "./WorktimeAccountBO";
import ActivityBO from "./ActivityBO";
import ProjectWorkBO from "./ProjectWorkBO";
import TimeIntervalBO from "./TimeIntervalBO";
import header from "../components/layout/Header";
import personForm from "../components/dialogs/PersonForm";
import EventBO from "./EventBO";
export default class HdMWebAppAPI {

    // Singelton instance
    static #api = null;


  // Local Python backend
  #hdmwebappServerBaseURL = '/hdmwebapp';

  // Person bezogen
  #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  #updatePersonURL = () => `${this.#hdmwebappServerBaseURL}/persons/`;

  //Projekt bezogen
  #getProjectsURL = () => `${this.#hdmwebappServerBaseURL}/projects`;

  // Projektarbeit bezogen
  #getProjectWorksforActivityURL = (id)  => `${this.#hdmwebappServerBaseURL}/activities/${id}/projectworks`;
  #updateProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #deleteProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #addProjectWorkURL = () => `${this.#hdmwebappServerBaseURL}/projectworks`;

  //Worktimeaccount bezogen
  #getWorktimeAccountURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}`;

    //Activity bezogen
    #getActivitiesURL = () => `${this.#hdmwebappServerBaseURL}/activities`;

  // Ereignis bezogen
  #addEventURL = () => `${this.#hdmwebappServerBaseURL}/events`;

  /**
   * Gibt die Singelton Instanz zurück
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


  updatePerson(PersonBO) {
    return this.#fetchAdvanced(this.#updatePersonURL(PersonBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(PersonBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    })
  }

    getPerson() {
        return this.#fetchAdvanced(this.#getPersonsURL()).then((responseJSON) => {
            let personBOs = PersonBO.fromJSON(responseJSON);
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(personBOs);
            })
        })
    }

  /**
   * Erstellt ein Ereignis und gibt eine Promise zurück, die ein neues EventBO
   * Objekt mit dem Eventtyp des Parameters eventBO als Ergebnis hat.
   *
   * @param {EventBO} eventBO welches erstellt werden soll.
   * @public
   */
  addEvent(eventBO) {
    return this.#fetchAdvanced(this.#addEventURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(eventBO)
    }).then((responseJSON) => {
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO);
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }

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

    getProjectWorks(id) {
        return this.#fetchAdvanced(this.#getProjectWorksforActivityURL(id)).then((responseJSON) => {
            let projectworkBOs = ProjectWorkBO.fromJSON(responseJSON);
            // console.log(projectworkBOs);
            return new Promise(function (resolve) {
                resolve(projectworkBOs);
            })
        })
    }

   /**
   * Adds a customer and returns a Promise, which resolves to a new CustomerBO object with the
   * firstName and lastName of the parameter customerBO object.
   *
   * @param {ProjectWorkBO} projectWorkBO to be added. The ID of the new customer is set by the backend
   * @public
   */
  addProjectWork(projectWorkBO) {
    return this.#fetchAdvanced(this.#addProjectWorkURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projectWorkBO)
    }).then((responseJSON) => {
      let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseProjectWorkBO);
      })
    })
  }

  /**
  * Updated ein ProjectWorkBO
  *
  * @param {ProjectWorkBO} projectWorkBO das geupdated werden soll
  * @public
  */
  updateProjectWork(projectWorkBO) {
    return this.#fetchAdvanced(this.#updateProjectWorkURL(projectWorkBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projectWorkBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
      console.log(responseProjectWorkBO)
      return new Promise(function (resolve) {
        resolve(responseProjectWorkBO);
      })
    })
  }

  /**
  * Löscht ein ProjectWorkBO
  *
  * @param {Number} projectWorkID des ProjectWorkBO, welches gelöscht werden soll
  * @public
  */
  deleteProjectWork(projectWorkID) {
    return this.#fetchAdvanced(this.#deleteProjectWorkURL(projectWorkID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
      console.log(responseProjectWorkBO)
      return new Promise(function (resolve) {
        resolve(responseProjectWorkBO);
      })
    })
  }
}
