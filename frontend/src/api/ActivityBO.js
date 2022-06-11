import BusinessObject from './BusinessObject';

//Stellt eine Aktivität im System dar
export default class ActivityBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Akitvitätsobjekt mit
   *
   * @param {String} aName - der Name dieses ActivityBO.
   * @param {String} aCapacity - die Kapazität dieses ActivityBO.
   * @param {String} anAffiliatedProject - das Projekt, das diesem ActivityBO zugeordnet ist.
   */
  constructor(aName, aCapacity, anAffiliatedProject) {
    super();
    this.name = aName;
    this.capacity = aCapacity;
    this.affiliated_project = anAffiliatedProject;
  }

  /**
   * Setzt einen neuen Namen.
   *
   * @param {String} aName - der neue Name dieses ActivityBO.
   */
  setActivityName(aName) {
    this.name = aName;
  }

  /**
   * Gibt den Namen zurück.
   */
  getActivityName() {
    return this.name;
  }

  /**
   * Setzt die Kapazität.
   *
   * @param {String} aCapacity - die neue Kapazität dieses ActivityBO.
   */
  setActivityCapacity(aCapacity) {
    this.capacity = aCapacity;
  }

  /**
   * Gibt die Kapazität zurück.
   */
  getActivityCapacity() {
    return this.capacity;
  }

  /**
   * Setzt einen neues zugeordnetes Projekt.
   *
   * @param {String} anAffiliatedProject - das neue zugeordnete Projekt dieses AktivityBO.
   */
  setAffiliatedProject(anAffiliatedProject) {
    this.affiliated_project = anAffiliatedProject;
  }

    /**
   * Gibt das zugeordnete Projekt zurück.
   */
  getAffiliatedProject() {
    return this.affiliated_project;
  }

  /**
   * Gibt einen Array mit ActivityBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(activities) {
    let result = [];

    if (Array.isArray(activities)) {
      activities.forEach((a) => {
        Object.setPrototypeOf(a, ActivityBO.prototype);
        result.push(a);
      })
    } else {
      let a = activities;
      Object.setPrototypeOf(a, ActivityBO.prototype);
      result.push(a);
    }
    //console.log(result)
    return result;
  }
}