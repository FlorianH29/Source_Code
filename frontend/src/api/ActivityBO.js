import BusinessObject from './BusinessObject';

//Stellt eine Aktivität im System dar
export default class ActivityBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Akitvitätsobjekt mit
   *
   * @param {String} aName - der Name dieses ActivityBO.
   * @param {String} aCapacity - die Kapazität dieses ActivityBO.
   * @param {String} anAffiliatedProject - das Projekt, das diesem ActivityBO zugeordnet ist.
   * @param {Number} aWorkTime - die Zeit, die für dieses ActivityBO gearbeitet wurde.
   */
  constructor(aName, aCapacity, anAffiliatedProject, aWorkTime) {
    super();
    this.name = aName;
    this.capacity = aCapacity;
    this.affiliated_project = anAffiliatedProject;
    this.work_time = aWorkTime;
  }

  /**
   * Setzt einen neuen Namen.
   *
   * @param {String} aName - der neue Name dieses ActivityBO.
   */
  setName(aName) {
    this.name = aName;
  }

  /**
   * Gibt den Namen zurück.
   */
  getName() {
    return this.name;
  }

  /**
   * Setzt die Kapazität.
   *
   * @param {String} aCapacity - die neue Kapazität dieses ActivityBO.
   */
  setCapacity(aCapacity) {
    this.capacity = aCapacity;
  }

  /**
   * Gibt die Kapazität zurück.
   */
  getCapacity() {
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
   * Setzt eine neue gearbeitet Zeit.
   *
   * @param {Number} aWorkTime - die neue gearbeitete Zeit dieses AktivityBO.
   */
  setWorkTime(aWorkTime) {
    this.work_time = aWorkTime;
  }

    /**
   * Gibt die gearbeitete Zeit zurück.
   */
  getWorkTime() {
    return this.work_time;
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