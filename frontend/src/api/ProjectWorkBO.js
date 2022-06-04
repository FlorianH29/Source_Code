import TimeIntervalBO from './BusinessObject';
import BusinessObject from "./BusinessObject";

//Stellt eine Projektarbeit im System dar
export default class ProjectWorkBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Projektarbeitsobjekt mit
   *
   * @param {String} aProjectWorkName - der Name dieses ProjectWorkBO.
   * @param {String} aDescription - die Beschreibung dieses ProjectWorkBO.
   * @param {Number} anAffiliatedActivity - die Aktivität, die diesem ProjectWorkBO zugeordnet ist.
   */
  constructor(aProjectWorkName, aDescription, anAffiliatedActivity) {
    super();
    this.project_work_name = aProjectWorkName;
    this.description = aDescription;
    this.affiliated_activity = anAffiliatedActivity;
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
   * @param {String} anAffiliatedActivity - die neue zugeordnete Aktivität dieses ProjectWorkBO.
   */
  setAffiliatedProject(anAffiliatedActivity) {
    this.affiliated_activity = anAffiliatedActivity;
  }

    /**
   * Gibt die zugeordnete Aktivität zurück.
   */
  getAffiliatedProject() {
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