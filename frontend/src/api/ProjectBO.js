import BusinessObject from './BusinessObject';

//Stellt ein Projekt im System dar
export default class ProjectBO extends BusinessObject {

  /**
   * Konstruktor, erstellt ein Projekt Objekt mit
   *
   * @param {String} aProjectName - der Name des ProjectBo.
   * @param {String} aClient - der Kunde des ProjectBO.
   * @param {Number} aTimeIntervalID - die TimeIntervalID des ProjectBO.
   * @param {Number} aOwner - der Owner des ProjectBO.
   */
  constructor(aProjectName, aClient, aTimeIntervalID) {
    super();
    this.project_name = aProjectName;
    this.client = aClient;
    this.timeinterval_id = 0;
    this.owner = 0;
    this.work_time = 0;

  }

  /**
   * Setzt einen neuen Projektnamen.
   *
   * @param {String} aProjectName - the new name of this ProjectBO.
   */
  setProjectName(aProjectName) {
    this.project_name = aProjectName;
  }

  /**
   * Gibt den Name zurück.
   */
  getProjectName() {
    return this.project_name;
  }

  /**
   * Sets a new client.
   *
   * @param {*} aClient - the new client of this ProjectBO.
   */
  setClient(aClient) {
    this.client = aClient;
  }

  /**
   * Gets the client.
   *
   */
  getClient() {
    return this.client;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {Number} aTimeIntervalID - die neue TimeIntervalId dieses ProjectBOs.
   */
  setTimeIntervallID(aTimeIntervalID) {
    this.timeinterval_id = aTimeIntervalID;
  }

  /**
   * getter der TimeIntervalId
   */
  getTimeInterval() {
    return this.timeinterval_id;
  }

  /**
   * Setzt einen neuen Owner.
   *
   * @param aOwner
   */
  setOwner(aOwner) {
    this.owner = aOwner;
  }

  /**
   *gibt den Owner zurück.
   */
  getOwner() {
    return this.owner;
  }


  /**
   * Gibt ein Array von ProjectBOs zurück.
   */
  static fromJSON(projects) {
    let result = [];

    if (Array.isArray(projects)) {
      projects.forEach((p) => {
        Object.setPrototypeOf(p, ProjectBO.prototype);
        result.push(p);
      })
    } else {

      let p = projects;
      Object.setPrototypeOf(p, ProjectBO.prototype);
      result.push(p);
    }

    //console.log(result)
    return result;
  }
}
