//Base class for all BusinessObjects, which has an ID field by default.
export default class BusinessObject {

  // Null Konstruktor
  constructor() {
    this.id = 0;
    this.last_edit = 0;
    this.deleted = 0;
  }

  // Setzt die ID des Business Objects
  setID(aId) {
    this.id = aId;
  }

  // Gibt die ID des Business Objects zurück
  getID() {
    return this.id;
  }

    // Setzt die ID des Business Objects
  setLastEdit(lastEdit) {
    this.last_edit = lastEdit;
  }

  // Gibt die ID des Business Objects zurück
  getLastEdit() {
    return this.last_edit;
  }

  // Gibt eine String Reprensentation des Objekts zurück, nützlich für das Debuggen
  toString() {
    let result = '';
    for (let prop in this) {
      result += prop + ': ' + this[prop] + ' ';
    }
    return result;
  }
}
