import PersonBO from './PersonBO';
import ProjectBO from './ProjectBO';
import WorktimeAccountBO from "./WorktimeAccountBO";
import ActivityBO from "./ActivityBO";
import ProjectWorkBO from "./ProjectWorkBO";
import TimeIntervalBO from "./TimeIntervalBO";
import navigator from "../components/layout/Navigator";
import personForm from "../components/dialogs/PersonForm";
import EventBO from "./EventBO";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default class HdMWebAppAPI {

    // Singelton instance
    static #api = null;


  // Local Python backend
  #hdmwebappServerBaseURL = '/hdmwebapp';

  // Person bezogen
  #getPersonsURL = (id) => `${this.#hdmwebappServerBaseURL}${id}`;
  #editPersonURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  #deletePersonURL = () =>`${this.#hdmwebappServerBaseURL}/persons`;


  //Projekt bezogen
  #getProjectsURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #updateProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #addProjectURL = () => `${this.#hdmwebappServerBaseURL}/projects`;
  #deleteProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;

  // Projektarbeit bezogen
  #getProjectWorksforActivityURL = (id)  => `${this.#hdmwebappServerBaseURL}/activities/${id}/projectworks`;
  #updateProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #deleteProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #addProjectWorkURL = () => `${this.#hdmwebappServerBaseURL}/projectworks`;
  #getOwnerOfProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/owner`;

  //Worktimeaccount bezogen
  #getWorktimeAccountURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}`;

  //Activity bezogen
  #getActivitiesForProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}/activities`;
  #updateActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #deleteActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #addActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/project/${id}/activities`;
  //#getActivityWorkTimeURL = (id) => `${this.#hdmwebappServerBaseURL}/work_time/${id}/activities`;

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


  editPerson(PersonBO) {
    return this.#fetchAdvanced(this.#editPersonURL(PersonBO.getID()), {
      method: 'PUT',
      navigator: {
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
    getPersons() {
    return this.#fetchAdvanced(this.#getPersonsURL()).then((responseJSON) => {
      let personBOs = PersonBO.fromJSON(responseJSON);
      //console.log(responseJSON);
      return new Promise(function (resolve) {
        resolve(personBOs);
      })
    })
  }

    getPerson(id) {
        return this.#fetchAdvanced(this.#getPersonsURL(id)).then((responseJSON) => {
            let personBOs = PersonBO.fromJSON(responseJSON)[0];
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(personBOs);
            })
        })
    }

    deletePerson() {
    return this.#fetchAdvanced(this.#deletePersonURL(), {
      method: 'DELETE'
    }).then((responseJSON) => {
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      console.log(responsePersonBO)
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
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


    getWorktimeAccount(id) {
        return this.#fetchAdvanced(this.#getWorktimeAccountURL(id)).then((responseJSON) => {
            let worktimeaccountBOs = WorktimeAccountBO.fromJSON(responseJSON);
            console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(worktimeaccountBOs);
            })
        })
    }

    getActivities(id) {
        return this.#fetchAdvanced(this.#getActivitiesForProjectURL(id)).then((responseJSON) => {
            let activityBOs = ActivityBO.fromJSON(responseJSON);
            console.log(activityBOs);
            return new Promise(function (resolve) {
                resolve(activityBOs);
            })
        })
    }

    getProject(id) {
        return this.#fetchAdvanced(this.#getProjectsURL(id)).then((responseJSON) => {
            let projectBOs = ProjectBO.fromJSON(responseJSON);
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(projectBOs);
            })
        })
    }

    /**
  * Updated ein ProjectBO
  *
  * @param {ProjectBO} projectBO das geupdated werden soll
  * @public
  */
  updateProject(projectBO) {
    return this.#fetchAdvanced(this.#updateProjectURL(projectBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projectBO)
    }).then((responseJSON) => {
      // Wir bekommen immer ein Array aus ProjectBOs.fromJSON
      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
      console.log(responseProjectBO)
      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })
  }

    /**
     * Fügt ein Projekt hinzu und gibt einen Promise zurück, der in einem neuen ProjectBO resultiert.
     *
     * @param {ProjectBO} projectBO wird geadded. Die ID des Projekts wird durch das Backend gesetzt.
     * @public
     */
    addProject(projectBO) {
        return this.#fetchAdvanced(this.#addProjectURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(projectBO)
        }).then((responseJSON) => {
            let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
            // console.info(projectBOs);
            return new Promise(function (resolve) {
                resolve(responseProjectBO);
            })
        })
    }


    /**
     * Löscht ein ProjectBO
     *
     * @param {Number} projectID des ProjectWorkBO, welches gelöscht werden soll
     * @public
     */
    deleteProject(projectID) {
        return this.#fetchAdvanced(this.#deleteProjectURL(projectID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            /**Wir bekommen immer ein Array mit ProjectBOs.fromJSON*/
            let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
            //console.log(responseProjectBO)
            return new Promise(function (resolve) {
                resolve(responseProjectBO);
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
        //Wir bekommen immer ein Array aus ProkectWorkBos.fromJSON
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

  /**
   * Gibt den Ersteller einer Projektarbeit zurück
   *
   * @param {Number} projectWorkID for which the balance should be retrieved
   * @public
   */
  getOwnerOfProjectWork(projectWorkID) {
    return this.#fetchAdvanced(this.#getOwnerOfProjectWorkURL(projectWorkID))
      .then(responseJSON => {
        return new Promise(function (resolve) {
          resolve(responseJSON);
          // console.log(responseJSON)
        })
      })
  }







    /**
   * Adds a customer and returns a Promise, which resolves to a new CustomerBO object with the
   * firstName and lastName of the parameter customerBO object.
   *
   * @param {ProjectBO} projectBO to be added. The ID of the new project is set by the backend
   * @public
   */
  addActivity(projectBO) {
    return this.#fetchAdvanced(this.#addActivityURL(), {
      method: 'POST',

      body: JSON.stringify(projectBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })
  }


/**
  getActivityWorkTime(activityBO) {
    return this.#fetchAdvanced(this.#getActivityWorkTimeURL(activityBO))
      .then(responseJSON => {
        console.log(responseJSON)
        return new Promise(function (resolve) {
          resolve(responseJSON);
        })
      })
  }
*/
  updateActivity(activityBO) {
    return this.#fetchAdvanced(this.#updateActivityURL(activityBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(activityBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseActivityBO = ActivityBO.fromJSON(responseJSON)[0];
      console.log(responseActivityBO)
      return new Promise(function (resolve) {
        resolve(responseActivityBO);
      })
    })
  }

  deleteActivity(activityID) {
    return this.#fetchAdvanced(this.#deleteActivityURL(activityID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseActivityBO = ActivityBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseActivityBO);
      })
    })
  }

}