import PersonBO from './PersonBO';
import ProjectBO from './ProjectBO';
import ActivityBO from "./ActivityBO";
import ProjectWorkBO from "./ProjectWorkBO";
import EventBO from "./EventBO";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default class HdMWebAppAPI {

    /** Entwurfsmuster Instanz */
    static #api = null;

    /** Lokales Python-Backend */
    #hdmwebappServerBaseURL = '/hdmwebapp';

    /** Person bezogen */
    #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/person`;
    #editPersonURL = () => `${this.#hdmwebappServerBaseURL}/person`;
    #deletePersonURL = () => `${this.#hdmwebappServerBaseURL}/person`;

    /** Projekt bezogen */
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
    #updateStartEventURL = (id) => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/startevent`;
    #updateEndEventURL = (id) => `${this.#hdmwebappServerBaseURL}/projectduration/${id}/endevent`;

    /** Projektarbeit bezogen */
    #getProjectWorksForActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}/projectworks`;
    #updateProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
    #deleteProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}`;
    #updateProjectWorkByNameURL = (id, name) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/${name}`;
    #addProjectWorkURL = () => `${this.#hdmwebappServerBaseURL}/projectworks`;
    #getOwnerOfProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/owner`;
    #getProjectWorksBetweenTimestampsURL = (id, startDate, endDate) =>
        `${this.#hdmwebappServerBaseURL}/activities/${id}/${startDate}/${endDate}/projectworks`;

    //Projectbeteiligte bezogen
    #getProjectMembersURL = (id) =>  `${this.#hdmwebappServerBaseURL}/projects/${id}/projectmembers`;
    #deleteProjectMemberURL = (id, pid) => `${this.#hdmwebappServerBaseURL}/projectmembers/${id}/${pid}`;
    #addProjectMemberURL = (id, pid) => `${this.#hdmwebappServerBaseURL}/projectmembers/${id}/${pid}`;
    #getNotProjectMembersURL = (id) =>  `${this.#hdmwebappServerBaseURL}/projects/${id}/persons`;

    /** Activity bezogen */
    #getActivitiesForProjectURL = (id) => `${this.#hdmwebappServerBaseURL}/projects/${id}/activities`;
    #updateActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
    #deleteActivityURL = (id) => `${this.#hdmwebappServerBaseURL}/activities/${id}`;
    #addActivityURL = () => `${this.#hdmwebappServerBaseURL}/activities`;
    #getActivityWorkTimeURL = (id, startDate, endDate) =>
        `${this.#hdmwebappServerBaseURL}/activities/${id}/${startDate}/${endDate}/work_time`;

    /** Ereignis bezogen */
    #addEventURL = () => `${this.#hdmwebappServerBaseURL}/events`;
    #getEventTransactionsAndTimeIntervalTransactionsURL = (startDate, endDate) =>
        `${this.#hdmwebappServerBaseURL}/eventtransactionsandtimeintervaltransactions/${startDate}/${endDate}`;
    #updateEventURL = (id, date) => `${this.#hdmwebappServerBaseURL}/events/${id}/${date}`;
    #getBreakStartedURL = () => `${this.#hdmwebappServerBaseURL}/breaks`;
    #getEventByProjectWorkURL = (id) => `${this.#hdmwebappServerBaseURL}/projectworks/${id}/event`;

    /** TimeIntervalTransaction bezogen */
    #getTimeIntervalTransactionsURL = () => `${this.#hdmwebappServerBaseURL}/timeintervaltransactions`;
    #deleteTimeIntervalURL = (id) => `${this.#hdmwebappServerBaseURL}/timeinterval/${id}`;

    /** Kommen bezogen */
    #getDepartureBiggerArriveURL = () => `${this.#hdmwebappServerBaseURL}/arrivedeparture`;
    #updateArriveURL = (id, date) => `${this.#hdmwebappServerBaseURL}/arrive/${id}/${date}`;
    #addArriveURL = () => `${this.#hdmwebappServerBaseURL}/arrive`;

    /** Gehen bezogen */
    #updateDepartureURL = (id, date) => `${this.#hdmwebappServerBaseURL}/departure/${id}/${date}`;
    #addDepartureURL = () => `${this.#hdmwebappServerBaseURL}/departure`;


    /**
     * Gibt die Singelton-Instanz zur??ck
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
     *  Gibt ein Promise zur??ck, das in ein JSON-Objekt aufgel??st wird.
     *  Das von fetch() zur??ckgegebene Promise wird den HTTP-Fehlerstatus nicht ablehnen, selbst wenn die Antwort HTTP 404
     *  oder 500 ist.
     *  fetchAdvanced wirft einen Fehler und auch einen Serverstatusfehler
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
        .then(res => {
                if (!res.ok) {
                    throw Error(`${res.status} ${res.statusText}`);
                }
                return res.json();
            }
        )

    /**
     * Updated ein ProjectWorkBO
     *
     * @param {PersonBO} personBO , das aktualisiert werden soll.
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
            /** Wir erhalten immer ein Array von PersonBO.fromJSON */
            let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responsePersonBO);
            })
        })
    }

    /**
     * Gibt zur??ck, ob das letzte Gehen einer Person gr????er ist als das letzte Kommen.
     */
    getDepartureBiggerArrive() {
        return this.#fetchAdvanced(this.#getDepartureBiggerArriveURL())
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
     * Erstellt ein PersonBO und gibt ein Promise zur??ck.
     */
    getPerson() {
        return this.#fetchAdvanced(this.#getPersonsURL()).then((responseJSON) => {
            let personBOs = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(personBOs);
            })
        })
    }

    /**
     * L??scht ein PersonBO.
     */
    deletePerson() {
        return this.#fetchAdvanced(this.#deletePersonURL(), {
            method: 'DELETE'
        }).then((responseJSON) => {
            let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responsePersonBO);
            })
        })
    }

    /**
     * Erstellt ein Ereignis und gibt eine Promise zur??ck, die ein neues EventBO
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Erstellt ein Gehen und gibt eine Promise zur??ck, die ein neues EventBO
     * Objekt als Ergebnis hat.
     */
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Erstellt ein Kommen und gibt eine Promise zur??ck, die ein neues EventBO
     * Objekt als Ergebnis hat.
     */
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Gibt ein Aktivit??ten zur??ck.
     */
    getActivities(id) {
        return this.#fetchAdvanced(this.#getActivitiesForProjectURL(id)).then((responseJSON) => {
            let activityBOs = ActivityBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(activityBOs);
            })
        })
    }

    /**
     * Gibt ein Projekt zur??ck, in welchem eine Person zugeteilt ist.
     */
    getProject(id) {
        return this.#fetchAdvanced(this.#getProjectsURL(id)).then((responseJSON) => {
            let projectBOs = ProjectBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(projectBOs);
            })
        })
    }

    /**
     * Gibt ein Projekt zur??ck, in welchem eine Person Owner ist.
     */
    getProjectsByOwner() {
        return this.#fetchAdvanced(this.#getProjectByOwnerURL()).then((responseJSON) => {
            let projectBOs = ProjectBO.fromJSON(responseJSON);
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
            /** Wir bekommen immer ein Array aus ProjectBOs.fromJSON*/
            let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseProjectBO);
            })
        })
    }

    /**
     * F??gt ein Projekt hinzu und gibt einen Promise zur??ck, der in einem neuen ProjectBO resultiert.
     *
     * @param {ProjectBO} projectBO wird hinzugef??gt. Die ID des Projekts wird durch das Backend gesetzt.
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
            return new Promise(function (resolve) {
                resolve(responseProjectBO);
            })
        })
    }

    /**
     * Gibt die Arbeitsleistung f??r ein Projekt f??r einen gesetzten Zeitraum zur??ck
     *
     * @param {Number} projectID f??r welche die Arbeitsleistung zur??ckgegeben werden soll
     * @param {Date} start Start des Zeitraums
     * @param {Date} end Ende des Zeitraums
     * @public
     */
    getProjectWorkTime(projectID, start, end) {
        return this.#fetchAdvanced(this.#getProjectWorkTimeURL(projectID, start, end))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
     * F??gt einen Projektstart in Form eines Events mit dem Event-Typ 7, also ein Start-Event, hinzu
     * und gibt ein Promise zur??ck.
     */
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * F??gt einen Projektende in Form eines Events mit dem Event-Typ 8, also ein Ende-Event, hinzu
     * und gibt ein Promise zur??ck.
     */
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Updated ein EventBO, bzw. ein Projekt-Start-Event
     *
     * @param {EventBO} eventBO das geupdated werden soll
     * @public
     */
    updateProjectDurationStart(eventBO) {
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Gibt ein Event einer Projektarbeit zur??ck.
     */
    getEventByProjectWork(projectWorkId) {
        return this.#fetchAdvanced(this.#getEventByProjectWorkURL(projectWorkId)).then((responseJSON) => {
            let eventBO = EventBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(eventBO);
            })
        })
    }

    /**
     * Updated ein EventBO, bzw. ein Projekt-End-Event
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
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Gibt das Start-Event eines Time Intervalls, eines Projekts zur??ck
     *
     * @param {Number} projectID f??r welche das Start_Event zur??ckgegeben werden soll
     * @public
     */
    getStartEvent(projectID) {
        return this.#fetchAdvanced(this.#getStartEventURL(projectID))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
     * Gibt das End-Event eines Time Intervalls, eines Projekts zur??ck
     *
     * @param {Number} projectID f??r welche das End-Event zur??ckgegeben werden soll
     * @public
     */
    getEndEvent(projectID) {
        return this.#fetchAdvanced(this.#getEndEventURL(projectID))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
     * L??scht ein ProjectBO
     *
     * @param {Number} projectID des ProjectWorkBO, welches gel??scht werden soll
     * @public
     */
    deleteProject(projectID) {
        return this.#fetchAdvanced(this.#deleteProjectURL(projectID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            /**Wir bekommen immer ein Array mit ProjectBOs.fromJSON*/
            let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseProjectBO);
            })
        })
    }

    /**
     * Gibt Events f??r Time-Interval-Transaktionen zur??ck.
     */
    getEventsForTimeIntervalTransactions(startDate, endDate) {
        return this.#fetchAdvanced(this.#getEventTransactionsAndTimeIntervalTransactionsURL(startDate, endDate)).then((responseJSON) => {
            let eventBOs = EventBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(eventBOs);
            })
        })
    }

    /**
     * Gibt Projektarbeiten einer Aktivit??t zur??ck.
     */
    getProjectWorks(id) {
        return this.#fetchAdvanced(this.#getProjectWorksForActivityURL(id)).then((responseJSON) => {
            let projectworkBOs = ProjectWorkBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(projectworkBOs);
            })
        })
    }

    /**
     * Gibt Projektarbeiten einer Aktivit??t in einem gegebenen Zeitraum zur??ck.
     */
    getProjectWorksBetweenTimestamps(id, startDate, endDate) {
        return this.#fetchAdvanced(this.#getProjectWorksBetweenTimestampsURL(id, startDate, endDate))
            .then((responseJSON) => {
            let projectworkBOs = ProjectWorkBO.fromJSON(responseJSON);
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
            return new Promise(function (resolve) {
                resolve(responseProjectWorkBO);
            })
        })
    }

    /**
     * Updated ein ProjectWorkBO Name anhand einer ID
     */
    updateProjectWorkNameByID(id, name) {
        return this.#fetchAdvanced(this.#updateProjectWorkByNameURL(id, name), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: id, name: name})
        }).then((responseJSON) => {
            //Wir bekommen immer ein Array aus ProjektWorkBos.fromJSON
            let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseProjectWorkBO);
            })
        })
    }

    /**
     * Updated ein Event anhand einer ID
     */
    updateEventByID(id, date) {
        return this.#fetchAdvanced(this.#updateEventURL(id, date), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: id, date: date})
        }).then((responseJSON) => {
            let responseEventBO = EventBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Updated ein Gehen-Event anhand einer ID
     */
    updateDepartureByID(id, date) {
        return this.#fetchAdvanced(this.#updateDepartureURL(id, date), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: id, date: date})
        }).then((responseJSON) => {
            let responseEventBO = EventBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * Updated ein Gehen-Event anhand einer ID
     */
    updateArriveByID(id, date) {
        return this.#fetchAdvanced(this.#updateArriveURL(id, date), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: id, date: date})
        }).then((responseJSON) => {
            let responseEventBO = EventBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * L??scht ein Zeitintervall
     */
    deleteTimeInterval(timeIntervalID) {
        return this.#fetchAdvanced(this.#deleteTimeIntervalURL(timeIntervalID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // Wir bekommen immer ein Array aus TimeIntervalBos.fromJSON
            let responseEventBO = EventBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseEventBO);
            })
        })
    }

    /**
     * L??scht ein ProjectWorkBO
     *
     * @param {Number} projectWorkID des ProjectWorkBO, welches gel??scht werden soll
     * @public
     */
    deleteProjectWork(projectWorkID) {
        return this.#fetchAdvanced(this.#deleteProjectWorkURL(projectWorkID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // Wir bekommen immer ein Array aus ProkectWorkBos.fromJSON
            let responseProjectWorkBO = ProjectWorkBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseProjectWorkBO);
            })
        })
    }

    /**
     * Gibt den Ersteller einer Projektarbeit zur??ck
     *
     * @param {Number} projectWorkID f??r welche der Ersteller zur??ckgegeben werden soll
     * @public
     */
    getOwnerOfProjectWork(projectWorkID) {
        return this.#fetchAdvanced(this.#getOwnerOfProjectWorkURL(projectWorkID))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
   * F??gt eine Aktivit??t hinzu und gibt ein Promise zur??ck, das sich in ein neues ActivityBO Objekt mit dem
   * Namen und der Kapazit??t des Parameters aufl??st.
   *
   * @param {ActivityBO} activityBO to be added. Die ID der neuen Aktivit??t wird vom Backend gesetzt.
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
      return new Promise(function (resolve) {
        resolve(responseActivityBO);
      })
    }).catch(e =>
      console.log(e))
  }

    /**
     * Gibt die Arbeitsleistung f??r eine Aktivit??t f??r einen gesetzten Zeitraum zur??ck
     *
     * @param {Number} activityID f??r welche die Arbeitsleistung zur??ckgegeben werden soll
     * @param {Number} start Start des Zeitraums
     * @param {Number} end Ende des Zeitraums
     * @public
     */
    getActivityWorkTime(activityID, start, end) {
        return this.#fetchAdvanced(this.#getActivityWorkTimeURL(activityID, start, end))
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
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
          // Wir bekommen immer ein Array aus ActivityBos.fromJSON
          let responseActivityBO = ActivityBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseActivityBO);
          })
        })
      }

      /**
      * L??scht ein ActivityBO
      *
      * @param {Number} activityID des ActivityBO, welches gel??scht werden soll
      * @public
      */
      deleteActivity(activityID) {
        return this.#fetchAdvanced(this.#deleteActivityURL(activityID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          //Wir bekommen immer ein Array aus ActivityBos.fromJSON
          let responseActivityBO = ActivityBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseActivityBO);
          })
        })
      }

    /**
     * Gibt zur??ck, ob eine Pause begonnen wurde oder nicht
     */
    getBreakStarted() {
        return this.#fetchAdvanced(this.#getBreakStartedURL())
            .then(responseJSON => {
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }
  getProjectMembers(id) {
      return this.#fetchAdvanced(this.#getProjectMembersURL(id)).then((responseJSON) => {
          let projectmembers = PersonBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
              resolve(projectmembers);
          })
      })
  }

  getPersonsNotProjectMembersOfProject(id) {
      return this.#fetchAdvanced(this.#getNotProjectMembersURL(id)).then((responseJSON) => {
          let notprojectmembers = PersonBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
              resolve(notprojectmembers);
          })
      })
  }


  deleteProjectMember(projectmemberID, projectID) {
    return this.#fetchAdvanced(this.#deleteProjectMemberURL(projectmemberID, projectID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    })
  }

  addPersonAsProjectMember(personBOs, projectID) {
      personBOs.map(person=> {
          return this.#fetchAdvanced(this.#addProjectMemberURL(person.getID(), projectID), {
              method: 'POST',
              headers: {
                  'Accept': 'application/json, text/plain',
                  'Content-type': 'application/json',
              },
              body: JSON.stringify(person.getID(), projectID)
          }).then((responseJSON) => {
              // We always get an array of CustomerBOs.fromJSON, but only need one object
              return new Promise(function (resolve) {
                  resolve();
              })
          }).catch(e =>
              console.log(e))
      })
  }
}
