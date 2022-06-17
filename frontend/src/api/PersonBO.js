import BusinessObject from './BusinessObject';

//Stellt eine Person im System dar
export default class PersonBO extends BusinessObject {

  /**
   * Hier wird eine Person mit hilfe des Konstruktur erstellt
   */
  constructor(aFirstname, aLastname, aMailAddress, auserName, aFireBaseId) {
    super();
    this.firstname = aFirstname;
    this.lastname = aLastname;
    this.username = auserName;
    this.mailaddress = aMailAddress;
    this.firebase_id = aFireBaseId;
  }

  /**
   * Hier wird der Vorname gesetzt.
   */
  setFirstName(aFirstname) {
    this.firstname = aFirstname;
  }

  /**
   * Gibt den Vornamen zurück.
   */
  getFirstName() {
    return this.firstname;
  }

  /**
   * Hier wird der Nachnamen gesetzt.
   */
  setLastName(aLastname) {
    this.lastname = aLastname;
  }

  /**
   * Gibt den Nachnamen zurück.
   */
  getLastName() {
    return this.lastname;
  }

  /**
   * Hier wird die Mailadresse gesetzt
   */
  setMailAddress(aMailAddress) {
    this.mailaddress = aMailAddress;
  }

  /**
   * Gibt die Mailadresse zurück.
   */
  getMailAddress() {
    return this.mailaddress;
  }

  setUserName(auserName) {
    this.username = auserName;
  }

  getUserName(){
    return this.username;
  }

  /**
   * Hier wird die FirebaseId gesetzt
   */
  setFireBaseId(aFireBaseId) {
    this.firebase_id = aFireBaseId;
  }

  /**
   * Gibt die Firebase ID zurück.
   */
  getFireBaseId() {
    return this.firebase_id;
  }

  /**
   * Gibt einen Array mit PersonBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(persons) {
    let result = [];

    if (Array.isArray(persons)) {
      persons.forEach((p) => {
        Object.setPrototypeOf(p, PersonBO.prototype);
        result.push(p);
      })
    } else {
      let p = persons;
      Object.setPrototypeOf(p, PersonBO.prototype);
      result.push(p);
    }
    //console.log(result)
    return result;
  }
}