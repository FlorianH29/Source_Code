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
  constructor(aProjectName, aClient, aTimeIntervalID, aOwner) {
    super();
    this.projectname = aProjectName;
    this.projectclient = aClient;
    this.timeintervallid = aTimeIntervalID;
    this.owner = aOwner;

  }

  /**
   * Setzt einen neuen Projektnamen.
   *
   * @param {String} aProjectName - the new name of this ProjectBO.
   */
  setProjectName(aProjectName) {
    this.projectname = aProjectName;
  }

  /**
   * Gets the projectname.
   */
  getProjectName() {
    return this.projectname;
  }

  /**
   * Sets a new client.
   *
   * @param {*} aClient - the new client of this ProjectBO.
   */
  setClient(aClient) {
    this.projectclient = aClient;
  }

  /**
   * Gets the client.
   *
   */
  getClient() {
    return this.projectclient;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {Number} aTimeIntervalID - die neue TimeIntervalId dieses ProjectBOs.
   */
  setTimeIntervallID(aTimeIntervalID) {
    this.timeintervallid = aTimeIntervalID;
  }

  /**
   * getter der TimeIntervalId
   */
  getTimeInterval() {
    return this.timeintervallid;
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
      // Es handelt sich offenbar um ein singuläres Objekt
      let p = projects;
      Object.setPrototypeOf(p, ProjectBO.prototype);
      result.push(p);
    }

    //console.log(result)
    return result;
  }
}
