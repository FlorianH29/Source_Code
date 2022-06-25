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
  #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  #editPersonURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  #deletePersonURL = () =>`${this.#hdmwebappServerBaseURL}/persons`;


  //Projekt bezogen
  #getProjectsURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #updateProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #addProjectURL = () => `${this.#hdmwebappServerBaseURL}/projects`;
  #deleteProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;

  // Projektarbeit bezogen
  #getProjectWorksForActivityURL = (id)  => `${this.#hdmwebappServerBaseURL}/activities/${id}/projectworks`;
  #updateProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #deleteProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #addProjectWorkURL = () => `${this.#hdmwebappServerBaseURL}/projectworks`;
  //Projectbeteiligte bezogen
  #getProjectMembersURL = (id) =>  `${this.#hdmwebappServerBaseURL}/projects/${id}/projectmembers`;
  #deleteProjectMemberURL = (id) => `${this.#hdmwebappServerBaseURL}/projectmembers/${id}`;
  #addProjectMemberURL = () => `${this.#hdmwebappServerBaseURL}/projectmembers`;
  #getNotProjectMembersURL = (id) =>  `${this.#hdmwebappServerBaseURL}/projects/${id}/persons`;

  //Worktimeaccount bezogen
  #getWorktimeAccountURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}`;

  //Activity bezogen
  #getActivitiesForProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}/activities`;
  #updateActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #deleteActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #addActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities`;

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

/**
  * Updated ein ProjectWorkBO
  *
  * @param {PersonBO} personBO das geupdated werden soll
  * @public
  */

  editPerson(personBO) {
    return this.#fetchAdvanced(this.#editPersonURL(), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      // We always get an array of PersonBO.fromJSON
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      console.info(personBO);
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
        console.log(responsePersonBO)
      })
    })
  }

    getPerson() {
        return this.#fetchAdvanced(this.#getPersonsURL()).then((responseJSON) => {
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
            //console.log(activityBOs);
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
        return this.#fetchAdvanced(this.#getProjectWorksForActivityURL(id)).then((responseJSON) => {
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
   * Fügt eine Aktivität hinzu und gibt ein Promise zurück, das sich in ein neues ActivityBO Objekt mit dem
   * Namen und der Kapazität des Parameters auflöst.
   *
   * @param {ActivityBO} activityBO to be added. Die ID der neuen Aktivität wird vom Backend gesetzt.
   * @public
   */
  addActivity(activityBO) {
    return this.#fetchAdvanced(this.#addActivityURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(activityBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseActivityBO = ActivityBO.fromJSON(responseJSON)[0];
      console.info(responseActivityBO);
      return new Promise(function (resolve) {
        resolve(responseActivityBO);
      })
    }).catch(e =>
      console.log(e))
  }

    /**
     * Updatet ein AktivityBO
     * @param {ActivityBO} activityBO das geupdated werden soll
     * @public
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

  /**
  * Löscht ein ActivityBO
  *
  * @param {Number} activityID des ActivityBO, welches gelöscht werden soll
  * @public
  */
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

  getProjectMembers(id) {
      return this.#fetchAdvanced(this.#getProjectMembersURL(id)).then((responseJSON) => {
          let projectmembers = PersonBO.fromJSON(responseJSON);
          //console.log(projectmembers);
          return new Promise(function (resolve) {
              resolve(projectmembers);
          })
      })
  }

  getPersonsNotProjectMembersOfProject(id) {
      return this.#fetchAdvanced(this.#getNotProjectMembersURL(id)).then((responseJSON) => {
          let notprojectmembers = PersonBO.fromJSON(responseJSON);
          console.log(notprojectmembers);
          return new Promise(function (resolve) {
              resolve(notprojectmembers);
          })
      })
  }


  deleteProjectMember(projectmemberID) {
    return this.#fetchAdvanced(this.#deleteProjectMemberURL(projectmemberID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    })
  }

  addProjectMember(personBO) {
    return this.#fetchAdvanced(this.#addProjectMemberURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      console.info(responsePersonBO);
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    }).catch(e =>
      console.log(e))
  }

}