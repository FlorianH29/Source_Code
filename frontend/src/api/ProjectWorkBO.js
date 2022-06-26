import TimeIntervalBO from './TimeIntervalBO';

/** Stellt eine Projektarbeit im System dar */
export default class ProjectWorkBO extends TimeIntervalBO {

  /**
   * Konstruktor, erstellt ein Projektarbeitsobjekt mit
   *
   * @param {Number} aStartEventId - die Id des Startevents des Zeitintervalls.
   * @param {Number} anEndEventId - die Id des Endevents des Zeitintervalls
   * @param {Number} aTimePeriod - der gespeicherte Zeitraum des Zeitintervalls.
   * @param {String} aProjectWorkName - der Name dieses ProjectWorkBO.
   * @param {String} aDescription - die Beschreibung dieses ProjectWorkBO.
   * @param {Number} anAffiliatedActivity - die Aktivität, die diesem ProjectWorkBO zugeordnet ist.
   */
  constructor(aProjectWorkName, aDescription) {
    super();
    this.project_work_name = aProjectWorkName;
    this.description = aDescription;
    this.affiliated_activity = 1;
  }

  /**
   * Setzt einen neuen Namen.
   *
   * @param {String} aProjectWorkName - der neue Name dieses ProjectWorkBO.
   */
  setProjectWorkName(aProjectWorkName) {
    this.project_work_name = aProjectWorkName;
  }

  /**
   * Gibt den Namen zurück.
   */
  getProjectWorkName() {
    return this.project_work_name;
  }

  /**
   * Setzt die Beschreibung.
   *
   * @param {*} aDescription - die neue Beschreibung dieses ProjectWorkBO.
   */
  setDescription(aDescription) {
    this.description = aDescription;
  }

  /**
   * Gibt die Beschreibung zurück.
   */
  getDescription() {
    return this.description;
  }

  /**
   * Setzt eine neue zugeordnete Aktivität.
   *
   * @param {Number} anAffiliatedActivity - die neue zugeordnete Aktivität dieses ProjectWorkBO.
   */
  setAffiliatedActivity(anAffiliatedActivity) {
    this.affiliated_activity = anAffiliatedActivity;
  }

   /**
   * Gibt die zugeordnete Aktivität zurück.
   */
  getAffiliatedActivity() {
    return this.affiliated_activity;
  }

  /**
   * Gibt einen Array mit ProjectWorkBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(projectWorks) {
    let result = [];

    if (Array.isArray(projectWorks)) {
      projectWorks.forEach((p) => {
        Object.setPrototypeOf(p, ProjectWorkBO.prototype);
        result.push(p);
      })
    } else {
      let p = projectWorks;
      Object.setPrototypeOf(p, ProjectWorkBO.prototype);
      result.push(p);
    }
    //console.log(result)
    return result;
  }
}