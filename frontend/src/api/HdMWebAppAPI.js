import PersonBO from './PersonBO';
import WorktimeaccountBO from "./WorktimeaccountBO";


export default class HdMWebAppAPI {

  // Singelton instance
  static #api = null;


  // Local Python backend
  #hdmwebappServerBaseURL = '/hdmwebapp';

  // Person bezogen
  // #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;

  // Person related
  #getPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  #addPersonsURL = () => `${this.#hdmwebappServerBaseURL}/persons`;
  //#getPersonsURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}`;
  #updatePersonsURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}`;
  #deletePersonsURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}`;
  #searchPersonsURL = (personName) => `${this.#hdmwebappServerBaseURL}/persons-by-name/${personName}`;


  // Account related
  #getAllWorktimeaccountsURL = () => `${this.#hdmwebappServerBaseURL}/worktimeaccounts`;
  #getWorktimeaccountsForPersonsURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}/worktimeaccounts`;
  #addWorktimeaccountsForPersonsURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}/worktimeaccounts`;
  //#getBalanceForWorktimeaccountURL = (id) => `${this.#hdmwebappServerBaseURL}/persons/${id}/balance`;
  #deleteWorktimeaccountIdURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccounts/${id}`;

  // Transaction related
  #getCreditsForWorktimeaccountIdURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}/credits`;
  #getDebitsForWorktimeaccountIdURL = (id) => `${this.#hdmwebappServerBaseURL}/worktimeaccount/${id}/debits`;
  #addTransactionURL = () => `${this.#hdmwebappServerBaseURL}/transactions`;


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
  getWorktimeaccountsForPerson(personID) {
    return this.#fetchAdvanced(this.#getWorktimeaccountsForPersonsURL(personID))
      .then((responseJSON) => {
        let worktimeaccountBOs = WorktimeaccountBO.fromJSON(responseJSON);
        // console.info(worktimeaccountBOs);
        return new Promise(function (resolve) {
          resolve(worktimeaccountBOs);
        })
      })
  }
}