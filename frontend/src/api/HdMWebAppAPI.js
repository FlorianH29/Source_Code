import PersonBO from './PersonBO';
import ProjectBO from './ProjectBO';
import WorktimeAccountBO from "./WorktimeAccountBO";
import ActivityBO from "./ActivityBO";
import ProjectWorkBO from "./ProjectWorkBO";
import TimeIntervalTransactionBO from "./TimeIntervalTransactionBO";
import TimeIntervalBO from "./TimeIntervalBO";
import navigator from "../components/layout/Navigator";
import EventBO from "./EventBO";
import DepartureBO from "./DepartureBO";
import ArriveBO from "./ArriveBO";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default class HdMWebAppAPI {

  // Singelton instance
  static #api = null;

  // Local Python backend
  #hdmwebappServerBaseURL = '/hdmwebapp';

  // Person bezogen
  #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/person`;
  #editPersonURL = () => `${this.#hdmwebappServerBaseURL}/person`;
  #deletePersonURL = () =>`${this.#hdmwebappServerBaseURL}/person`;

  //Projekt bezogen
  #getProjectsURL = () => `${this.#hdmwebappServerBaseURL}/projects`;
  #updateProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #addProjectURL = () => `${this.#hdmwebappServerBaseURL}/projects`;
  #deleteProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}`;
  #addProjectDurationStartEvent = () => `${this.#hdmwebappServerBaseURL}/projectduration`;
  #addProjectDurationEndEvent = () => `${this.#hdmwebappServerBaseURL}/projectduration`;
  #getProjectWorkTimeURL = (id, startDate, endDate) =>
      `${this.#hdmwebappServerBaseURL}/projects/${id}/${startDate}/${endDate}/work_time`;
  #getProjectByOwnerURL = () => `${this.#hdmwebappServerBaseURL}/projectsowner`;
  #getStartEventURL = (id) => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/startevent`;
  #getEndEventURL = (id) => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/endevent`;
  #updateStartEventURL = (id)  => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/startevent`;
  #updateEndEventURL = (id)  => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/endevent`;


  //#addProjectDurationURL = () => `${this.#hdmwebappServerBaseURL}/projectduration`;
  // Projektarbeit bezogen
  #getProjectWorksforActivityURL = (id)  => `${this.#hdmwebappServerBaseURL}/activities/${id}/projectworks`;
  #updateProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #deleteProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
  #updateProjectWorkByNameURL = (id, name) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/${name}`;
  #addProjectWorkURL = () => `${this.#hdmwebappServerBaseURL}/projectworks`;
  #getOwnerOfProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/owner`;

  //Worktimeaccount bezogen
  #getWorktimeAccountURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}`;

  //Activity bezogen
  #getActivitiesForProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}/activities`;
  #updateActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #deleteActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
  #addActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/project/${id}/activities`;
  #getActivityWorkTimeURL = (id, startDate, endDate) =>
      `${this.#hdmwebappServerBaseURL}/activities/${id}/${startDate}/${endDate}/work_time`;

    // Ereignis bezogen
    #addEventURL = () => `${this.#hdmwebappServerBaseURL}/events`;
    #addDepartureURL = () => `${this.#hdmwebappServerBaseURL}/departure`;
    #addArriveURL = () => `${this.#hdmwebappServerBaseURL}/arrive`;
    #getEventTransactionsAndTimeIntervalTransactionsURL = (startDate, endDate) =>
        `${this.#hdmwebappServerBaseURL}/eventtransactionsandtimeintervaltransactions/${startDate}/${endDate}`;
    #updateEventURL = (id, date) => `${this.#hdmwebappServerBaseURL}/events/${id}/${date}`;
    #updateArriveURL = (id, date) => `${this.#hdmwebappServerBaseURL}/arrive/${id}/${date}`;
    #updateDepartureURL = (id, date) => `${this.#hdmwebappServerBaseURL}/departure/${id}/${date}`;

    // TimeIntervalTransaction bezogen
    #getTimeIntervalTransactionsURL = () => `${this.#hdmwebappServerBaseURL}/timeintervaltransactions`;
    #deleteTimeIntervalURL = (id) => `${this.#hdmwebappServerBaseURL}/timeinterval/${id}`;

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
  async addEvent(eventBO) {
    return await this.#fetchAdvanced(this.#addEventURL(), {
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

  addDeparture() {
    return this.#fetchAdvanced(this.#addDepartureURL(), {
        method: 'POST',
        headers: {
            'Accept': 'application/jason, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify("")
    }).then((responseJSON) => {
        let responseEventBO = EventBO.fromJSON(responseJSON)[0];
        console.log(responseEventBO);
        return new Promise(function (resolve) {
            resolve(responseEventBO);
        })
    })
  }

  addArrive() {
    return this.#fetchAdvanced(this.#addArriveURL(), {
        method: 'POST',
        headers: {
            'Accept': 'application/jason, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify("")
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

    getProjectsByOwner() {
        return this.#fetchAdvanced(this.#getProjectByOwnerURL()).then((responseJSON) => {
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
   * Gibt die Arbeitsleistung für ein Projekt für einen gesetzten Zeitraum zurück
   *
   * @param {Number} projectID für welche die Arbeitsleistung zurückgegeben werden soll
   * @param {Date} start Start des Zeitraums
   * @param {Date} end Ende des Zeitraums
   * @public
   */
  getProjectWorkTime(projectID, start, end) {
    return this.#fetchAdvanced(this.#getProjectWorkTimeURL(projectID, start, end))
      .then(responseJSON => {
        //console.log(responseJSON)
        return new Promise(function (resolve) {
          resolve(responseJSON);
        })
      })
  }

    addProjectDurationStartEvent(eventBO) {
        return this.#fetchAdvanced(this.#addProjectDurationStartEvent(), {
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

    addProjectDurationEndEvent(eventBO) {
        return this.#fetchAdvanced(this.#addProjectDurationEndEvent(), {
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

    /**
  * Updated ein EventBO
  *
  * @param {EventBO} eventBO das geupdated werden soll
  * @public
  */
  updateProjectDurationStart(eventBO) {
      console.log(eventBO)
    return this.#fetchAdvanced(this.#updateStartEventURL((eventBO.getID())), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(eventBO)
    }).then((responseJSON) => {
      // Wir bekommen immer ein Array aus ProjectBOs.fromJSON
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO)
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }


   /**
  * Updated ein ProjectBO
  *
  * @param {EventBO} eventBO das geupdated werden soll
  * @public
  */
  updateProjectDurationEnd(eventBO) {
    return this.#fetchAdvanced(this.#updateEndEventURL(eventBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(eventBO)
    }).then((responseJSON) => {
      // Wir bekommen immer ein Array aus ProjectBOs.fromJSON
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO)
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }

    /**
     * Gibt das Start-Event eines Time Intervalls, eines Projekts zurück
     *
     * @param {Number} projectID für welche das Start_Event zurückgegeben werden soll
     * @public
     */
    getStartEvent(projectID) {
        return this.#fetchAdvanced(this.#getStartEventURL(projectID))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                    //console.log(responseJSON)
                })
            })
    }


    /**
     * Gibt das End-Event eines Time Intervalls, eines Projekts zurück
     *
     * @param {Number} projectID für welche das End-Event zurückgegeben werden soll
     * @public
     */
    getEndEvent(projectID) {
        return this.#fetchAdvanced(this.#getEndEventURL(projectID))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                    //console.log(responseJSON)
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

    getTimeIntervalTransactions() {
        return this.#fetchAdvanced(this.#getTimeIntervalTransactionsURL()).then((responseJSON) => {
            let timeIntervalTransactionsBOs = TimeIntervalTransactionBO.fromJSON(responseJSON);
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(timeIntervalTransactionsBOs);
            })
        })
    }

    getEventsForTimeIntervalTransactions(startDate, endDate) {
        return this.#fetchAdvanced(this.#getEventTransactionsAndTimeIntervalTransactionsURL(startDate, endDate)).then((responseJSON) => {
            let eventBOs = EventBO.fromJSON(responseJSON);
            //console.log(responseJSON);
            return new Promise(function (resolve) {
                resolve(eventBOs);
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
   * Erstellt eine Projektarbeit mit Name und Beschreibung, die im Dialog gesetzt wurden.
   *
   * @param {ProjectWorkBO} projectWorkBO welcehes erstellt werden soll.
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

  updateProjectWorkNameByID(id, name){
          return this.#fetchAdvanced(this.#updateProjectWorkByNameURL(id, name), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({id: id, name: name})
    }).then((responseJSON) => {
        //Wir bekommen immer ein Array aus ProkectWorkBos.fromJSON
      let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
      console.log(responseProjectWorkBO)
      return new Promise(function (resolve) {
        resolve(responseProjectWorkBO);
      })
    })
  }

    updateEventByID(id, date){
          return this.#fetchAdvanced(this.#updateEventURL(id, date), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({id: id, date: date})
    }).then((responseJSON) => {
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO)
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }

      updateDepartureByID(id, date){
          return this.#fetchAdvanced(this.#updateDepartureURL(id, date), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({id: id, date: date})
    }).then((responseJSON) => {
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO)
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }

      updateArriveByID(id, date){
          return this.#fetchAdvanced(this.#updateArriveURL(id, date), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({id: id, date: date})
    }).then((responseJSON) => {
      let responseEventBO = EventBO.fromJSON(responseJSON)[0];
      console.log(responseEventBO)
      return new Promise(function (resolve) {
        resolve(responseEventBO);
      })
    })
  }


    deleteTimeInterval(timeIntervalID) {
        return this.#fetchAdvanced(this.#deleteTimeIntervalURL(timeIntervalID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // We always get an array of CustomerBOs.fromJSON
            let responseEventBO = EventBO.fromJSON(responseJSON)[0];
            console.log(responseEventBO)
            return new Promise(function (resolve) {
                resolve(responseEventBO);
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
   * @param {Number} projectWorkID für welche der Ersteller zurückgegeben werden soll
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
   * Gibt die Arbeitsleistung für eine Aktivität für einen gesetzten Zeitraum zurück
   *
   * @param {Number} activityID für welche die Arbeitsleistung zurückgegeben werden soll
   * @param {Number} start Start des Zeitraums
   * @param {Number} end Ende des Zeitraums
   * @public
   */
  getActivityWorkTime(activityID, start, end) {
      //console.log(activityID)
    return this.#fetchAdvanced(this.#getActivityWorkTimeURL(activityID, start, end))
      .then(responseJSON => {
        //console.log(responseJSON)
        return new Promise(function (resolve) {
          resolve(responseJSON);
         // console.log(responseJSON);
        })
      })
  }

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
